import HttpServer from './base/HttpServer'
import jsonwebtoken from 'jsonwebtoken'

import { IEncryptedToken } from './types/Http'
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes
} from 'crypto'

import {
  IMealAsOrder,
  OrderStatus
} from './types/db/Order'
import { UserRole } from './types/db/Users'
import { IDbDeliveryInfo } from './types/db/Delivery'

class Utils {
  constructor(public server: HttpServer) {}

  public hash(str: string): Promise<string> {
    return new Promise(
      (resolve) => resolve(
        createHash('sha256')
          .update(str)
          .digest('hex') ?? ''
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

  // admin only
  public async createUserTest(returnJwt: boolean = true) {
    const email = `${this.genRand()}@example.com`,
      pin = 1000 + Math.floor(
        Math.random() * 1000
      ),
      uid = randomBytes(16).toString('hex'),
      data = { email, pin, uid, role: 0 },
      user = new this.server.models.Users(data)

    await user.save()

    if (returnJwt)
      return await this.encryptJWT({ uid }, 86400)
    else return user
  }

  // admin only
  public async getUserByToken(token: string) {
    // decrypt jwt token
    const data = await this.decryptJWT(token)
    if (!data) return null
       
    return await this.server.models.Users.findOne(data)
      .select('-_id')
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

  public async getMeal(uid: string) {
    const company = await this.server.models.Companies.findOne(
      { 'meals.uid': uid },
      { 'meals.$': 1 }
    )
    
    return company?.meals[0] || null
  }

  public async getCompany(uid: string) {
    return await this.server.models.Companies.findOne({ uid })
      .select('-_id')
  }

  public async getCompanies() {
    return await this.server.models.Companies.find({})
      .select('-_id')
  }

  public async createOrder(
    user: string,
    meals: IMealAsOrder[],
    address: string
  ) {
    const orderId = randomBytes(8)
      .toString('hex'),
      order = {
        uid: orderId,
        meals, 

        address,
        status: OrderStatus.PROCESSED
      }
    
    await this.server.models.Users.updateOne(
      { uid: user },
      {
        $push: { orders: order }
      }
    )
    
    return order
  }

  public async modifyOrderStatus(user: string, orderId: string, status: OrderStatus) {
    return await this.server.models.Users.updateOne(
      {
        uid: user,
        'orders.uid': orderId
      },
      {
        $set: {
          'orders.$.status': status
        }
      }
    )
  }

  public async modifyDeliveryStatus(user: string, orderId: string, status: OrderStatus) {
    return await this.server.models.Users.updateOne(
      {
        uid: user,
        'deliveries.uid': orderId
      },
      {
        $set: {
          'deliveries.$.status': status
        }
      }
    )
  }

  public async claimOrder(driver: string, orderId: string) {
    const data = await this.server.models.Users.findOne(
      { 'orders.uid': orderId },
      { 'orders.$': 1 }
    )

    return data?.orders[0] ?? null
  }

  public async requestToken(email: string, pin: number, isRider: boolean) {
    const filter = { email, pin, role: UserRole.CUSTOMER }
    if (isRider)
      filter.role = UserRole.DRIVER
     
    const user = await this.server.models.Users.findOne(filter)
    if (user)
      return  await this.encryptJWT(
        { uid: user.uid },
        86400
      )
    else return null
  }

  public async getOrders() {
    const orders = await this.server.models.Users.find(
      {},
      { orders: 1, _id: 0 } 
    )

    return orders.reduce(
      (acc, curr) => [
        ...acc,
        ...curr.orders.filter(
          (order) => order.status < OrderStatus.DELIVERED
        )
      ],
      []
    )
  }

  public async createDelivery(
    user: string,
    from: IDbDeliveryInfo,
    to: IDbDeliveryInfo,
    item: string 
  ) {
    const deliveryId = randomBytes(8)
      .toString('hex'),
      delivery = {
        from,
        to,

        item,
        uid: deliveryId,

        status: OrderStatus.PROCESSED
      }

    return await this.server.models.Users.updateOne(
      { uid: user },
      {
        $push: { deliveries: delivery }
      }
    )
  }
}

export default Utils