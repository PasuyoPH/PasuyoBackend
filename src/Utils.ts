import HttpServer from './base/HttpServer'
import jsonwebtoken from 'jsonwebtoken'
import { HttpReq, IEncryptedToken } from './types/Http'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto'
import { IAuthUser, INewUser } from './types/data'
import HttpError from './base/HttpError'
import { BASE_DELIVERY_FEE, DeliveryFees } from './types/v2/Fees'
import IRateRider from './types/data/RateRider'
import { IRider, IRiderStates } from './types/db'
import Tables from './types/Tables'
import { IJob, IJobTypes } from './types/db/Job'
import { IDelivery } from './types/db/Delivery'
import Bytes from './base/Bytes'
import IJobOptions from './types/data/JobOptions'
import UserUtils from './utils/User'
import RiderUtils from './utils/Rider'
import WsUtils from './utils/Ws'
import { ProtocolSendTypes } from './types/v2/ws/Protocol'
import V2JobOptions from './types/v2/Job'
import { Geo } from './types/v2/Geo'
import { V2Job, V2JobStatus, V2JobTypeAsText, V2JobTypes } from './types/v2/db/Job'
import V2HttpErrorCodes from './types/v2/http/Codes'
import V2Address from './types/v2/db/Address'
import busboy from 'busboy'
import { Services } from './types/v2/PasuyoService'
import V2Token from './types/v2/db/Token'
import { V2RiderStates } from './types/v2/db/User'

class Utils {
  public user: UserUtils
  public rider: RiderUtils

  public ws: WsUtils

  constructor(public server: HttpServer) {
    this.user  = new UserUtils(this.server)
    this.rider = new RiderUtils(this.server)

    this.ws    = new WsUtils(this.server)
  }

  public async calculateXp(distance: number) {
    return this.server.config.xp.unitPerDistance *
      Math.pow(
        distance,
        this.server.config.xp.scale
      )
  }

  public async jobLocationToIDs(points: Buffer) {
    const floatSizes = 4 + 4, // auto skip this amount. longitude & latitude
      uidSize = 32,
      ids: string[] = []

    let offset = 0 + floatSizes // start with the id already
    while (offset < points.length) {
      const uid = points.toString(
        'utf-8',
        offset,
        offset + uidSize
      )
      
      ids.push(uid)
      offset += uidSize + floatSizes // move the offset
    }

    return ids
  }

  public async jobInfoToText(job: V2Job) {
    const name = V2JobTypeAsText[job.type] ?? 'Unknown Job'
    let data: string

    switch (job.type) {
      case V2JobTypes.PADELIVER:
        data = job.item
        break

      default:
        data = 'Unknown?'
        break
    }

    return { name, data }
  }

  public async updateRiderState(uid: string, state: V2RiderStates, noDb?: boolean) {
    if (!noDb) {
      const users = await this.server.db.table(Tables.v2.Riders)
        .update({ state })
        .where({ uid })
        .returning('*')

      await this.server.utils.user.updateUserToWs(users[0])
    }

    // notify websocket that rider state changed
    await this.server.utils.ws.send(
      {
        c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_STATE,
        d: { state, uid }
      }
    )
  }

  public async getJobSelectedFields(includeExtra?: boolean) {
    return [
      'createdAt',
      'fee',
      'distance',
      'eta',
      'item',
      'status',
      'type',
      'uid',
      'weight',
      'rider',
      'draft',
      ...(
        includeExtra ? [
          'startedAt',
          'finishedAt'
        ] : []
      )
    ]
  }

  public async generateFileHash(content: Buffer) {
    const hash = createHash('sha256')
    hash.update(content)

    return hash.digest('hex')
  }

  public async addExpoToken(token: string, uid: string, isRider?: boolean) {
    return await this.server.db.table(isRider ? Tables.v2.Tokens : Tables.v2.UserTokens)
      .insert(
        {
          token,
          [isRider ? 'rider' : 'user']: uid
        }
      )
      .onConflict('token')
      .merge()
  }

  public async deleteExpoToken(token: string, uid: string, isRider: boolean) {
    return await this.server.db.table(isRider ? Tables.v2.Tokens : Tables.v2.UserTokens)
      .delete('*')
      .where(
        {
          token,
          [isRider ? 'rider' : 'user']: uid
        }
      )
  }

  public parseFile(req: HttpReq): Promise<Buffer> {
    return new Promise(
      (resolve, reject) => {
        const bus = busboy(
          { headers: req.headers }
        )
    
        bus.on(
            'file',
            (_, stream) => {
              let chunk: Buffer
      
              stream.on(
                  'data',
                  (data: Buffer) => {
                    if (!chunk) chunk = data
                    else chunk = Buffer.concat(
                      [chunk, data]
                    )
                  }
                )
                .on('end', () => resolve(chunk))
                .on('error', reject)
            }
          )
          .on('error', reject)
    
        req.pipe(bus)
      }
    )
  }

  public calculateDeliveryFee(distance: number | string) {
    if (isNaN(distance as any))
      distance = 0

    if (typeof distance === 'string')
      distance = parseInt(distance)

    const nearest = DeliveryFees.filter(
        (fee) => fee.distance <= (distance as number)
      )
      .sort(
        ((a, b) => b.distance - a.distance)
      )

    if (nearest.length < 1)
      return DeliveryFees[DeliveryFees.length - 1]
    else return nearest[0]
  }

  public calculateDeliveryFeeV2(distance: number | string) {
    if (typeof distance === 'string')
      distance = Number(distance)

    return Math.round(
      BASE_DELIVERY_FEE + (
        (distance - 1) * 10
      )
    )
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
        V2HttpErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide a proper email.'
      )

    if (
      !data.pin ||
      data.pin.length < 4 ||
      !data.pin.match(/[0-9]/g)
    )
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_PIN,
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
            V2HttpErrorCodes.AUTH_DUPL,
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
        V2HttpErrorCodes.AUTH_INVALID_EMAIL,
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
        V2HttpErrorCodes.AUTH_FAILED,
        'No user found with this phone.'
      )

    if (user.pin !== pin)
      throw new HttpError(
        V2HttpErrorCodes.AUTH_INVALID_PIN,
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
        V2HttpErrorCodes.RATING_RIDER_CUSTOMER_ONLY,
        'This rider does not exist. Please make sure you rate an existing rider.'
      )

    if (data.rating < 1 || data.rating > 5)
      throw new HttpError(
        V2HttpErrorCodes.RATING_RATE_INVALID,
        'Rating invalid, please provide from 1-5.'
      )

    if (data.comment) {
      if (data.comment.length < 3)
        throw new HttpError(
          V2HttpErrorCodes.RATING_COMMENT_TOO_SHORT,
          'Comment provided was too short, please try a little longer.'
        )

      if (data.comment.length > 300)
        throw new HttpError(
          V2HttpErrorCodes.RATING_COMMENT_TOO_LONG,
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
        V2HttpErrorCodes.DELIVERY_INVALID_ITEM,
        'Please provide a proper item for the service.'
      )

    for (const prop of props)
      if (!data.from[prop] || !data.to[prop])
        throw new HttpError(
          V2HttpErrorCodes.DELIVERY_MISSING_DATA,
          'Please complete the required data for delivery.'
        )
  }

  public async pointsToBuffer(
    geo: { uid: string } & Geo
  ): Promise<Buffer> {
    /*const size = 8,
      length = Array.isArray(geo) ? geo.length : 1,
      buffer = Buffer.alloc(length * size)

    for (let i = 0; i < length; i++) {
      const data = Array.isArray(geo) ? geo[i] : geo

      buffer.writeFloatLE(data.latitude, i * size)
      buffer.writeFloatLE(data.longitude, i * size + 4)
    }

    return buffer*/

    const size = 8 + geo.uid.length,
      buffer = Buffer.alloc(size)

    buffer.writeFloatLE(geo.latitude)
    buffer.writeFloatLE(geo.longitude, 4)
    buffer.write(geo.uid, 8, 'utf-8')

    return buffer
  }

  public async fetchAddress(uid: string): Promise<V2Address> {
    return await this.server.db.table(Tables.v2.Address)
      .select('*')
      .where({ uid })
      .first()
  }

  public async getExpoTokens(): Promise<V2Token[]> {
    return await this.server.db.table(Tables.v2.Tokens)
  }

  public async createJobV2(
    { creator, type, points, draft, ...other }: V2JobOptions
  ) {
    const serviceFound = Services.find(
      (service) => service.type === type
    )

    if (!serviceFound)
      throw new HttpError(
        V2HttpErrorCodes.JOB_INVALID_TYPE,
        'Invalid job type was provided. Please make sure to place the correct values.'
      )

    if (!points || points.length < 2)
      throw new HttpError(
        V2HttpErrorCodes.JOB_INVALID_POINTS,
        'Invalid location points where provided. Please make sure there are atleast 2.'
      )

    const startPoint = await this.fetchAddress(points[0]),
      finalPoint = await this.fetchAddress(points[points.length - 1])

    if (!startPoint || !finalPoint)
      throw new HttpError(
        V2HttpErrorCodes.JOB_INVALID_POINTS,
        'Provided location points don\'t exist in our data. Please make sure to choose an existing address data.'
      )

    if (
      isNaN(other.weight as any) ||
      typeof other.item !== 'string'
    )
      throw new HttpError(
        V2HttpErrorCodes.JOB_INVALID_DELIVERY,
        'Invalid delivery data was provided.'
      )

    const uid = await this.genUID(),
      distance = await this.server.utils.user.calculateDistance(
        [
          {
            latitude: startPoint.latitude,
            longitude: startPoint.longitude
          },
          
          {
            latitude: finalPoint.latitude,
            longitude: finalPoint.longitude
          }
        ]
      ),
      data: V2Job = {
        uid,
        creator,
        type,
        status: V2JobStatus.PROCESSED,
        createdAt: Date.now(),
        startPoint: await this.pointsToBuffer(
          {
            uid: startPoint.uid,
            latitude: startPoint.latitude,
            longitude: startPoint.longitude
          }
        ),
        finalPoint: await this.pointsToBuffer(
          {
            uid: finalPoint.uid,
            latitude: finalPoint.latitude,
            longitude: finalPoint.longitude
          }
        ),
        item: other.item,
        weight: Number(other.weight),
        draft: true, // make it always a draft
        startX: startPoint.longitude,
        startY: startPoint.latitude,
        ...distance
      }

    await this.server.db.table(Tables.v2.Jobs)
      .insert(data)

    return data
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
          V2HttpErrorCodes.JOB_INVALID_TYPE,
          'Job type not supported. Please try again.'
        )
      }
    }
  }
}

export default Utils