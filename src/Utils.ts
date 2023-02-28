import HttpServer from './base/HttpServer'
import jsonwebtoken from 'jsonwebtoken'

import { IEncryptedToken, IErrorCodes } from './types/Http'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto'

import { IAuthUser, INewUser } from './types/data'
import HttpError from './base/HttpError'

import { ITokenData } from './types/Token'
import IRateRider from './types/data/RateRider'

import { IRider, IRiderStates } from './types/db'
import Tables from './types/Tables'

import { IJob, IJobTypes } from './types/db/Job'
import { IDelivery } from './types/db/Delivery'

import Bytes from './base/Bytes'
import IJobOptions from './types/data/JobOptions'

import UserUtils from './utils/User'
import RiderUtils from './utils/Rider'

class Utils {
  public user: UserUtils
  public rider: RiderUtils

  constructor(public server: HttpServer) {
    this.user  = new UserUtils(this.server)
    this.rider = new RiderUtils(this.server)
  }

  public hash(str: string): Promise<string> {
    return new Promise(
      (resolve) => resolve(
        createHash('sha256')
          .update(str)
          .digest('hex') ?? ''
      )
    )
  }

  public genUID(len: number = 16): Promise<string> {
    return new Promise(
      (resolve) => resolve(
        randomBytes(len)
          .toString('hex')
      )
    )
  }

  private genRand() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.-',
      len = 16,
      res = []

    for (let i = 0; i < len; i++)
      res.push(
        chars[
          Math.floor(Math.random() * chars.length)
        ]
      )

    return res.join('')
  }

  public encryptJWT(data: any, expiresIn: number): Promise<string> {
    return new Promise(
      (resolve) => {
        const iv = randomBytes(16),
          token = jsonwebtoken.sign(
              data,
              this.server.config.jwt_secret,
              { expiresIn: expiresIn * 1000 }
            ),
            cipher = createCipheriv(
              'aes-256-ctr',
              this.server.config.cypher_iv_key,
              iv
            ),
            encrypted = Buffer.concat(
              [
                cipher.update(token),
                cipher.final()
              ]
            )
          
        // create one more jwt token, this time containing the encrypted version and iv
        return resolve(
          jsonwebtoken.sign(
            {
              iv: iv.toString('hex'),
              token: encrypted.toString('hex')
            },
            this.server.config.jwt_secret
          )
        )
      }
    )
  }

  public decryptJWT<T>(token: string): Promise<T | null> {
    return new Promise(
      (resolve) => {
        try {
          jsonwebtoken.verify(token, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const data: IEncryptedToken = jsonwebtoken.decode(token),
          decipher = createDecipheriv(
            'aes-256-ctr',
            this.server.config.cypher_iv_key,
            Buffer.from(data.iv, 'hex')
          ),
          decrypted = Buffer.concat(
            [
              decipher.update(
                Buffer.from(data.token, 'hex')
              ),
              decipher.final()
            ]
          )

        const jwt = decrypted.toString()
        try {
          jsonwebtoken.verify(jwt, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const jsonData = jsonwebtoken.decode(jwt) as T
        return resolve(jsonData)
      }
    )
  }

  public async createUser(data: INewUser, isRider: boolean = false) {
    if (!data.email?.match(/.+@.+\..+/g))
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide a proper email.'
      )

    if (
      !data.pin ||
      data.pin.length !== 4 ||
      !data.pin.match(/[0-9]/g)
    )
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_PIN,
        'Please provide a proper pin code.'
      )

    try {
      const uid = await this.genUID(),
        user = isRider ? {
          uid,
          state: IRiderStates.RIDER_UNAVAILABLE,

          verified: false,
          ...data
        } : { uid, ...data },
        token = await this.encryptJWT(
          {
            uid,
            pin: data.pin,

            role: isRider ? 'RIDER' : 'CUSTOMER'
          },
          86400
        )

      await this.server.db.table(isRider ? Tables.v2.Riders : Tables.v2.Users)
        .insert(user)

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

  public async getUserToken(
    data: IAuthUser,
    rider: boolean = false
  ) {
    const { phone, pin } = data
    /*if (!email?.match(/.+@.+\..+/g))
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide a proper email.'
      )*/

    const user = await this.server.db.table(rider ? Tables.Riders : Tables.Customers)
      .select('*')
      .where(
        { phone: phone.startsWith('0') ? phone : '0' + phone }
      )
      .first()

    if (!user)
      throw new HttpError(
        IErrorCodes.AUTH_FAILED,
        'No user found with this phone.'
      )

    if (user.pin !== pin)
      throw new HttpError(
        IErrorCodes.AUTH_INVALID_PIN,
        'Incorrect pin was provided. Please try again.'
      )

    return await this.encryptJWT(
      {
        uid: user.uid,
        pin,

        role: rider ? 'RIDER' : 'CUSTOMER'
      },
      86400
    )
  }

  public async getRiderByID(uid: string): Promise<IRider> {
    return await this.server.db.table(Tables.Riders)
      .select('*')
      .where({ uid })
      .first()
  }

  public async rateRider(
    by: string,
    riderID: string,
    data: IRateRider
  ) {
    // try to verify rider
    const rider = await this.getRiderByID(riderID)
    if (!rider)
      throw new HttpError(
        IErrorCodes.RATING_RIDER_CUSTOMER_ONLY,
        'This rider does not exist. Please make sure you rate an existing rider.'
      )

    if (data.rating < 1 || data.rating > 5)
      throw new HttpError(
        IErrorCodes.RATING_RATE_INVALID,
        'Rating invalid, please provide from 1-5.'
      )

    if (data.comment) {
      if (data.comment.length < 3)
        throw new HttpError(
          IErrorCodes.RATING_COMMENT_TOO_SHORT,
          'Comment provided was too short, please try a little longer.'
        )

      if (data.comment.length > 300)
        throw new HttpError(
          IErrorCodes.RATING_COMMENT_TOO_LONG,
          'Comment provided was too long, please try a little shorter.'
        )
    }

    const uid = await this.genUID(),
      insertData = {
        uid,
        rider: rider.uid,

        ...data,
        by
      }
      
    await this.server.db.insert(insertData)
      .into(Tables.Rates)

    return insertData
  }

  public async takeJob(jobID: string, riderID: string) {

  }

  public async getUserJobs(uid: string): Promise<IJob[]> {
    return await this.server.db.select('*')
      .from(Tables.Jobs)
      .where(
        { creator: uid }
      )
  }

  public verifyDeliveryProps(data: IDelivery) {
    const props = [
      'fullName',
      'location'
    ]

    if (!data.item || data.item.length < 3)
      throw new HttpError(
        IErrorCodes.DELIVERY_INVALID_ITEM,
        'Please provide a proper item for the service.'
      )

    for (const prop of props)
      if (!data.from[prop] || !data.to[prop])
        throw new HttpError(
          IErrorCodes.DELIVERY_MISSING_DATA,
          'Please complete the required data for delivery.'
        )
  }

  public async createJob(
    {
      creator,
      type,
      data
    }: IJobOptions
  ) {
    const uid = await this.genUID()
    
    switch (type) {
      case IJobTypes.PADELIVER: {
        this.verifyDeliveryProps(data)

        // typings purposes
        const delivery = data as IDelivery,
          sizes = { // byte length of data
            from: (2 * 3) +
              delivery.from.fullName.length +
              delivery.from.location.length +
              (delivery.from.landmark ?? '').length,

            to: (2 * 3) +
              delivery.to.fullName.length +
              delivery.to.location.length +
              (delivery.to.landmark ?? '').length,

            item: (2 + delivery.item.length)
          },
          bytes = new Bytes(sizes.from + sizes.to + sizes.item)

        // from data
        bytes.writeInt16(delivery.from.fullName.length)
          .writeStr(delivery.from.fullName)
          .writeInt16(delivery.from.location.length)
          .writeStr(delivery.from.location)
          .writeInt16(
            (delivery.from.landmark ?? '').length
          )
          .writeStr(delivery.from.landmark ?? '')

        // to data
        bytes.writeInt16(delivery.to.fullName.length)
          .writeStr(delivery.to.fullName)
          .writeInt16(delivery.to.location.length)
          .writeStr(delivery.to.location)
          .writeInt16(
            (delivery.to.landmark ?? '').length
          )
          .writeStr(delivery.to.landmark ?? '')
        
        // item
        bytes.writeInt16(delivery.item.length)
            .writeStr(delivery.item)

        const insertData = {
          creator, type, uid,
          data: bytes.data()
        }

        await this.server.db.insert(insertData)
          .into(Tables.Jobs)

        return insertData
      }

      default: {
        throw new HttpError(
          IErrorCodes.JOB_INVALID_TYPE,
          'Job type not supported. Please try again.'
        )
      }
    }
  }
}

export default Utils