import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'

import V2CreateUserOptions from '../types/v2/utils/User'
import V2HttpErrorCodes from '../types/v2/http/Codes'

import Tables from '../types/Tables'
import { V2Rider, V2RiderStates, V2User, V2UserRoles } from '../types/v2/db/User'

import V2Auth from '../types/v2/http/Auth'
import { V2TokenData } from '../types/v2/Token'
import V2HttpAddressData from '../types/v2/http/Address'
import V2Address from '../types/v2/db/Address'

class UserUtils {
  constructor(public server: HttpServer) {}

  public async create(
    { user, rider }: V2CreateUserOptions
  ) {
    if (!user.email?.match(/.+@.+\..+/g))
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide a proper email.'
      )

    if (
      !user.pin ||
      user.pin.length !== 4 ||
      !user.pin.match(/[0-9]/g)
    )
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_PIN,
        'Please provide a proper pin code.'
      )

    if (!user.phone.startsWith('0'))
      user.phone = '0' + user.phone

    try {
      const role = rider ? V2UserRoles.RIDER : V2UserRoles.CUSTOMER,
        uid = await this.server.utils.genUID(),
        data: V2User | V2Rider = {
          ...user,
          ...(
            rider ? {
              state: V2RiderStates.RIDER_UNAVAILABLE,
              verified: false
            } : {}
          ),

          uid,
          role
        },
        token = await this.server.utils.encryptJWT(
          {
            uid,
            pin: user.pin,

            role
          },
          86400
        )
      
      await this.server.db.table(rider ? Tables.v2.Riders : Tables.v2.Users)
        .insert(data)

      return token
    } catch(err) {
      switch (Number(err.code)) {
        case 23505: {
          throw new HttpError(
            V2HttpErrorCodes.AUTH_DUPL,
            'This email or phone number provided is already in use. Please try a different one.'
          )
        }
      }
    }
  }

  public async getAddresses(user: string): Promise<V2Address[]> {
    return this.server.db.table(Tables.v2.Address)
      .select('*')
  }

  public async newAddress(user: string, data: V2HttpAddressData) {
    // validate
    if (
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    )
      throw new HttpError(
        V2HttpErrorCodes.ADDRESS_INVALID_GEOLOCATION,
        'Invalid latitude/longitude values provided.'
      )

    if (typeof data.formattedAddress !== 'string')
      throw new HttpError(
        V2HttpErrorCodes.ADDRESS_INVALID_FORMATTED_ADDRESS,
        'Invalid formatted address provided.'
      )

    if (
      typeof data.contactName !== 'string' ||
      data.contactName.length < 3
    )
      throw new HttpError(
        V2HttpErrorCodes.ADDRESS_INVALID_CONTACT_NAME,
        'Invalid contact name provided.'
      )

    if (isNaN(data.contactPhone as any))
      throw new HttpError(
        V2HttpErrorCodes.ADDRESS_IVNALID_CONTACT_PHONE,
        'Invalid contact phone number provided.'
      )

    const address: V2Address = {
      ...data,

      user,
      uid: await this.server.utils.genUID()
    }

    await this.server.db.table(Tables.v2.Address)
      .insert(address)

    return address
  }

  public async token(data: V2Auth) {
    const { phone, pin } = data
    const user = await this.server.db.table(data.rider ? Tables.v2.Riders : Tables.v2.Users)
      .select('*')
      .where(
        { phone: phone.startsWith('0') ? phone : '0' + phone }
      )
      .first()

    if (!user)
      throw new HttpError(
        V2HttpErrorCodes.AUTH_FAILED,
        'No user found with this phone.'
      )

    if (user.pin !== pin)
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_PIN,
        'Incorrect pin was provided. Please try again.'
      )

    return await this.server.utils.encryptJWT(
      {
        uid: user.uid,
        pin,

        role: data.rider ? V2UserRoles.RIDER : V2UserRoles.CUSTOMER
      },
      86400
    )
  }

  public async fromToken(token: string) {
    const data = await this.server.utils.decryptJWT<V2TokenData>(token)
    if (!data) return
    
    let table: string
    switch (data.role) {
      case V2UserRoles.CUSTOMER:
        table = Tables.v2.Users
        break

      case V2UserRoles.RIDER:
        table = Tables.v2.Riders
        break

      default:
        table = null
        break
    }

    if (!table)
      throw new HttpError(
        V2HttpErrorCodes.TOKEN_INVALID_ROLE,
        'Invalid role provided on token. Malformed token?'
      )

    const { uid, pin } = data
    return await this.server.db.table(table)
      .select('*')
      .where({ uid, pin })
      .first()
  }

  public async deleteAddress(user: string, uid: string) {
    const result = await this.server.db.table(Tables.v2.Address)
      .delete()
      .where({ user, uid })

    return result > 0
  }
}

export default UserUtils