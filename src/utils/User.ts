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
import { Geo } from '../types/v2/Geo'
import axios from 'axios'
import { V2Job } from '../types/v2/db/Job'
import { ProtocolSendTypes } from '../types/v2/ws/Protocol'

const API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json'

class UserUtils {
  constructor(public server: HttpServer) {}

  public async finalizeJob(user: string, uid: string) {
    const job = (
      await this.server.db.table(Tables.v2.Jobs)
        .select('*')
        .where({ uid, creator: user })
        .first()
    ) as V2Job

    if (!job) return null // should throw error instead
    job.draft = false

    await this.server.db.table(Tables.v2.Jobs)
      .update(job)
      .where(
        { uid: job.uid }
      )

    const latitude = job.startPoint.readFloatLE(0),
      longitude = job.startPoint.readFloatLE(4),
      address = job.startPoint.toString('utf-8', 8)

      this.server.utils.ws.send( // notify ws new job was finalized
        {
          c: ProtocolSendTypes.JOB_NEW,
          d: {
            uid,
            geo: {
              address,
              latitude,
              longitude
            },
            tokens: (
              await this.server.db.table(Tables.v2.Tokens)
                .select('*')
            )
          }
        }
      )
      
    return job
  }

  public async create(
    { user, rider }: V2CreateUserOptions
  ) {
    if (!user.fullName || user.fullName.length < 2)
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_NAME,
        'Please provide a proper name.'
      )

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
              state: V2RiderStates.RIDER_ONLINE,
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
      .where({ user })
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

  public async calculateDistance(points: Geo[]): Promise<
    {
      fee: number
      distance: number
      eta: number
    }
  > {    
    if (!Array.isArray(points) || points.length < 2)
      throw new HttpError(
        V2HttpErrorCodes.DISTANCE_INVALID_POINTS,
        'Invalid points provided. Make sure to have at least two.'
      )

    const [origin, ...destinations] = points,
      encode = (point: Geo) => {
        if (
          typeof point.latitude !== 'number' ||
          typeof point.longitude !== 'number'
        )
          throw new HttpError(
            V2HttpErrorCodes.DISTANCE_MUST_BE_FLOAT,
            'Please provide a float for the points.'
          )

        return point.latitude + ',' + point.longitude
      },
      params = new URLSearchParams()

    params.append('origins', encode(origin))
    params.append(
      'destinations',
      destinations.map(
        (point) => encode(point)
      ).join('|')
    )
    params.append('key', this.server.config.google.apikey)

    console.log(params)

    const { data } = await axios(
        {
          method: 'get',
          url: API_URL + '?' + params.toString()
        }
      ),
      results = data.rows[0].elements

    let totalMeters = 0,
      totalSeconds = 0

    for (const result of results) {
      totalMeters += result.distance?.value ?? 0
      totalSeconds += result.duration?.value ?? 0
    }

    return {
      fee: this.server.utils.calculateDeliveryFeeV2(totalMeters / 1000),
      distance: Math.round(
        (totalMeters / 1000) * 10
      ) / 10, // km
      eta: totalSeconds // seconds
    }
  }
}

export default UserUtils