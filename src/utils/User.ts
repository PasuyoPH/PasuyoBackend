import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'

import { IErrorCodes } from '../types/Http'
import CreateUserOptions from '../types/utils/User'

import Tables from '../types/Tables'
import { V2Rider, V2RiderStates, V2User } from '../types/v2/db/User'

class UserUtils {
  constructor(public server: HttpServer) {}

  public async create(
    { user, rider }: CreateUserOptions
  ) {
    if (!user.email?.match(/.+@.+\..+/g))
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide a proper email.'
      )

    if (
      !user.pin ||
      user.pin.length !== 4 ||
      !user.pin.match(/[0-9]/g)
    )
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_PIN,
        'Please provide a proper pin code.'
      )

    if (!user.phone.startsWith('0'))
      user.phone = '0' + user.phone

    try {
      const uid = await this.server.utils.genUID(),
        data: V2User | V2Rider = {
          ...user,
          ...(
            rider ? {
              state: V2RiderStates.RIDER_UNAVAILABLE,
              verified: false
            } : {}
          ),

          uid,
          role: rider ? 'RIDER' : 'CUSTOMER'
        },
        token = await this.server.utils.encryptJWT(
          {
            uid,
            pin: user.pin,

            role: rider ? 'RIDER' : 'CUSTOMER'
          },
          86400
        )
      
      await this.server.db.table(rider ? Tables.Riders : Tables.Customers)
        .insert(data)

      return token
    } catch(err) {
      switch (Number(err.code)) {
        case 23505: {
          throw new HttpError(
            IErrorCodes.AUTH_DUPL,
            'This email or phone number provided is already in use. Please try a different one.'
          )
        }
      }
    }
  }
}

export default UserUtils