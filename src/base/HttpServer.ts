import restana from 'restana'
import { IConfig } from '../types/Config'
import Path from './Path'
import Utils from '../utils'
import moment from 'moment'
import knex, { Knex } from 'knex'
import WebSocket from 'ws'
import Expo from 'expo-server-sdk'
import { S3 } from '@aws-sdk/client-s3'
import Storages from '../types/Storages'
import EventEmitter from 'events'

import JobSchema from '../schemas/Job'
import AddressSchema from '../schemas/Address'
import AddressUsedSchema from '../schemas/AddressUsed'
import AdminSchema from '../schemas/Admins'
import ReferralSchema from '../schemas/Referral'
import RiderSchema from '../schemas/Rider'
import UserSchema from '../schemas/User'
import Schema from './Schema'
import PromoSchema from '../schemas/Promos'
import NotificationSchema from '../schemas/Notification'
import OpenEvent from '../ws/events/Open'
import CloseEvent from '../ws/events/Close'
import ExpoTokenSchema from '../schemas/ExpoToken'
import LoadRequestSchema from '../schemas/LoadRequest'
import MerchantSchema from '../schemas/Merchant'
import OrderSchema from '../schemas/Order'
import MerchantItemSchema from '../schemas/MerchantItem'
import LikesSchema from '../schemas/Likes'
import PaypalAuthToken from '../types/http/PaypalAuthToken'
import Job2Schema from '../schemas/Job2'
import TransactionSchema from '../schemas/Transaction'
import DeliverySchema from '../schemas/Delivery'
import MerchantAccountSchema from '../schemas/MerchantAccount'

class HttpServer extends EventEmitter {
  public restana = restana()
  public routes: Map<string, Path> = new Map()
  public PROCESS_CWD = process.cwd()
  //public utils = new Utils(this)
  public cache = {
    ttl: 5, // in minutes
    data: new Map<string, { expiry: number, data: Buffer } | undefined>() // cache url reponses instead
  }
  public db: Knex<any, unknown[]>
  public ws: WebSocket
  //public geo: Map<string, GeoCacheData> = new Map()
  public expo = new Expo()
  public storages: Storages
  public paypalAccessToken: string = null

  // new content
  public utils = new Utils(this)

  private paypalAccessTokenTimeout: NodeJS.Timeout = null

  constructor(public config: IConfig) {
    super()

    if (this.config.ws.enabled)
      this.setupWebsocket()

    this.db = knex(
      {
        client: 'pg',
        connection: {
          host: this.config.db.host,
          port: this.config.db.port as any,
  
          user: this.config.db.user,
          password: this.config.db.pass,
  
          database: this.config.db.dbName
        }
      }
    )

    this.setupDatabase()
    this.storages = {
      evidences: new S3(
        this.generateS3Config('evidences')
      ),
      profiles: new S3(
        this.generateS3Config('profiles')
      ),
      load: new S3(
        this.generateS3Config('load')
      )
    }

    // payments
    this.preparePaypal()
  }

  private async preparePaypal() {
    try {
      await this.log('[INFO]: Fetching Paypal Accesss Token')
      this.on(
        'paypal_access_token',
        async (data: PaypalAuthToken) => {        
          if (this.paypalAccessTokenTimeout)
            clearTimeout(this.paypalAccessTokenTimeout)

          await this.log('[INFO]: Received new Paypal Access Token:', data.access_token)

          this.paypalAccessToken = data.access_token
          this.paypalAccessTokenTimeout = setTimeout(
            async () => {
              this.paypalAccessToken = null
              await this.utils.paypal.getAccessToken()
            },
            (data.expires_in * 1000) - 5000 // fetch 5 seconds advance
          )
        }
      )

      await this.utils.paypal.getAccessToken()
    } catch(err) {
      if (this.paypalAccessToken) return
      
      await this.log('[ERROR]: Paypal Access Token failed. Retrying in 2 seconds...')
      setTimeout(
        async () => await this.preparePaypal(),
        2 * 1000
      )
    }
  }

  private generateS3Config(bucket: string) {
    return {
      region: this.config.s3.region,
      endpoint: this.config.s3.endpoint + '/' + bucket,
      credentials: {
        accessKeyId: this.config.s3.accessKey,
        secretAccessKey: this.config.s3.secretKey
      }
    }
  }

  private async setupDatabase() {
    const tables: (typeof Schema)[] = [
      AddressSchema,
      AddressUsedSchema,
      AdminSchema,
      JobSchema,
      Job2Schema,
      ReferralSchema,
      RiderSchema,
      UserSchema,
      PromoSchema,
      NotificationSchema,
      ExpoTokenSchema,
      LoadRequestSchema,
      MerchantSchema,
      OrderSchema,
      MerchantItemSchema,
      LikesSchema,
      TransactionSchema,
      DeliverySchema,
      MerchantAccountSchema
    ]

    for (const Schema of tables) {
      const tableExists = await this.db.schema.hasTable(Schema.tableName)
      if (!tableExists)
        await this.db.schema.createTable(
          Schema.tableName,
          (table) => (new Schema(table)).handle()
        )
    }

    //await this.test()
  }

  public async log(...content: any[]) {
    return new Promise(
      (resolve) => resolve(
        console.log(
          moment()
            .format('LLL'),
          '|',
          ...content
        )
      )
    )
  }

  public async ready() {
    // create 10 test accounts
    /*for (let i = 0; i < 10; i++)
      await this.tests()*/

    return this.restana.start(this.config.http.port)
  }

  public async register(path: typeof Path) {
    const pathInstance  = new path()
    pathInstance.server = this

    this.routes.set(pathInstance.path, pathInstance)
    await pathInstance.register(this)

    await this.log(
      'Route:',
      pathInstance.path,
      'added with method:',
      pathInstance.method.toUpperCase()
    )
  }

  public async setupWebsocket() {
    this.ws = new WebSocket(`ws://${this.config.ws.address}:${this.config.ws.port}`)

    const openEvent = new OpenEvent(this),
      closeEvent = new CloseEvent(this)

    const reconnect = () => {
      setImmediate(
        () => setTimeout(
          () => this.setupWebsocket(),
          this.config.ws.interval
        )
      )
    }

    this.ws
      .on('open', openEvent.handle.bind(openEvent))
      .on(
        'close',
        async () => {
          const callback = closeEvent.handle.bind(closeEvent)
          callback()

          await this.log('Connection closed. Attempting to reconnect...')
          reconnect()
        }
      )
      .on('error', () => {})
  }
}

export default HttpServer
