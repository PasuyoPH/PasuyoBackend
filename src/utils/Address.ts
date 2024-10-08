import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Address from '../types/database/Address'
import { AddressUsed, AddressUsedType } from '../types/database/AddressUsed'
import User from '../types/database/User'
import NewAddressData from '../types/http/NewAddressData'

class AddressUtils {
  constructor(public server: HttpServer) {}

  public async edit(
    address: Address,
    uid: string,
    user: string
  ) {
    const addressUsed = await this.server.db.table<AddressUsed>('address_used')
      .select('type')
      .where('addressUid', uid)

    if (addressUsed.length > 0)
      throw new HttpError(
        HttpErrorCodes.ADDRESS_USED_BY_JOB,
        'Address is currently being used by a job. Please try again'
      )

    return (
      await this.server.db.table<Address>(Tables.Address)
        .update(
          {
            ...address,
            uid,
            user
          }
        )
        .where({ uid, user })
        .returning('*')
    )[0]
  }

  /**
   * Get all addresses associated with the user id.
   * @param uid ID of the user to filter the addresses with.
   */
  public async getUserAddresses(uid: string) {
    return this.server.db.table<Address>(Tables.Address)
      .select('*')
      .where({ user: uid })
  }

  /**
   * Deletes a specific address in the database.
   * This will throw an error if the address is currently used in a job.
   * @param uid The id of the database to delete.
   * @param user The id of the user who made the address. This is for safety reasons.
   */
  public async delete(uid: string, user: string, merchant?: boolean) {
    // Immediately check if this address is being used
    const addressUsed = await this.server.db.table<AddressUsed>('address_used')
      .select('type')
      .where('addressUid', uid)

    if (addressUsed.length > 0)
      throw new HttpError(
        HttpErrorCodes.ADDRESS_USED_BY_JOB,
        'Address is currently being used by a job. Please try again'
      )

    // Delete address
    return await this.server.db.table<Address>(Tables.Address)
      .delete()
      .where(
        {
          uid,
          user,
          ...(merchant ? { merchant } : {})
        }
      )
  }
  
  /**
   * Fetches addresses from the database.
   * @param uids The ids of the addresses to fetch.
   */
  public async get(uids: string[]): Promise<Address[]> {
    if (uids.length <= 1)
      return await this.server.db.table<Address>(Tables.Address)
        .select('*')
        .where({ uid: uids[0] })
    else return await this.server.db.table<Address>(Tables.Address)
      .select('*')
      .whereIn('uid', uids)
      .orderByRaw(
        `CASE ${uids.map((id, idx) => `WHEN uid = '${id}' THEN ${idx}`).join(' ')} END`
      )
  }

  /**
   * Creates a new address for a user.
   * @param data The data of the address.
   * @param user The user that will make the address.
   */
  public async create(data: NewAddressData, user: User) {
    if (
      !data.text ||
      data.text.length < 3
    )
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_TEXT,
        'Please make sure you place a proper location for the address.'
      )

    if (
      !data?.template ||
      data?.template.length < 3
    )
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_NOTE,
        'Your address template name must be at least 3 characters long.'
      )

    if (
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    )
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_GEOLOCATION,
        'Invalid latitude/longitude points provided.'
      )

    if (typeof data.text !== 'string')
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_FORMATTED_ADDRESS,
        'Invalid text address provided.'
      )

    if (!data.useUserData) {
      if (
        typeof data.contactName !== 'string' ||
        data.contactName.length < 2
      )
        throw new HttpError(
          HttpErrorCodes.ADDRESS_INVALID_CONTACT_NAME,
          'Contact name is too short, please try again.'
        )

      if (isNaN(data.contactPhone as any))
        throw new HttpError(
          HttpErrorCodes.ADDRESS_IVNALID_CONTACT_PHONE,
          'Invalid contact phone number provided, please try again.'
        )
    } else {
      data.contactName = user.fullName
      data.contactPhone = user.phone
    }

    const address: Address = {
      ...data,
      user: user.uid,
      uid: await this.server.utils.crypto.genUID(),
      createdAt: Date.now()
    }

    await this.server.db.table<Address>(Tables.Address)
      .insert(address)

    return address
  }

  public async markAsUsed(job: string, addresses: Address[]) {
    return await this.server.db.table<AddressUsed>(Tables.AddressUsed)
    .insert(
      addresses.map(
        (point, idx) => {
          return {
            addressUid: point.uid,
            latitude: point.latitude,
            longitude: point.longitude,
            jobUid: job,
            type: idx === 0 ?
              AddressUsedType.START : (
                idx === addresses.length - 1 ?
                  AddressUsedType.END :
                  AddressUsedType.MID
              ),
            index: idx !== 0 && idx !== addresses.length - 1 ?
              idx - 1 :
              -1,
            createdAt: Date.now(),
            
            text: point.text,
            landmark: point.landmark
          }
        }
      )
    )
  }
}

export default AddressUtils