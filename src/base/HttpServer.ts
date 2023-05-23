import restana from 'restana'
import { IConfig } from '../types/Config'

import Path from './Path'
import Utils from '../Utils'

import moment from 'moment'
import knex, { Knex } from 'knex'

import WebSocket from 'ws'
import OpenEvent from '../ws/events/Open'

import MessageEvent from '../ws/events/Message'
import { GeoCacheData } from '../types/v2/Geo'

import CloseEvent from '../ws/events/Close'
import Expo from 'expo-server-sdk'
import { S3 } from '@aws-sdk/client-s3'
import Storages from '../types/v2/Storages'

// Schemas
import CustomerSchema from '../schemas/Customer'
import DeliveriesSchema from '../schemas/Deliveries'

import RiderSchema from '../schemas/Rider'
import RatesSchema from '../schemas/Rates'

import JobSchema from '../schemas/Job'

// v2 Schemas
import { V2RiderSchema, V2UserSchema } from '../schemas/v2/User'
import V2AddressSchema from '../schemas/v2/Address'
import V2JobSchema from '../schemas/v2/Job'
import V2TokensSchema, { V2UserTokensSchema } from '../schemas/v2/Tokens'
import V2ReferralSchema from '../schemas/v2/Referrals'
import V2NotificationsSchema from '../schemas/v2/Notifications'
import V2TransactionSchema from '../schemas/v2/Transaction'
import V2LoadRequestSchema from '../schemas/v2/LoadRequest'
import V2PromosSchema from '../schemas/v2/Promos'
import V2MerchantSchema from '../schemas/v2/Merchant'

class HttpServer {
  public restana = restana()
  public routes: Map<string, Path> = new Map()
  public PROCESS_CWD = process.cwd()
  public utils = new Utils(this)
  public cache = {
    ttl: 5, // in minutes
    data: new Map<string, { expiry: number, data: Buffer } | undefined>() // cache url reponses instead
  }
  public db: Knex<any, unknown[]>
  public ws: WebSocket
  public geo: Map<string, GeoCacheData> = new Map()
  public expo = new Expo()
  public storages: Storages

  constructor(public config: IConfig) {
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
    
    if (this.config.ws.enabled)
      this.setupWebsocket()

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
  
    // for testing purposes
    /*this.storages.evidences.putObject(
      {
        Bucket: 'sin1',
        Body: Buffer.from('TESTING 123'),
        Key: 'test.txt'
      }
    )*/
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

  public async setupWebsocket() {
    this.ws = new WebSocket(`ws://${this.config.ws.address}:${this.config.ws.port}`)

    const openEvent = new OpenEvent(this),
      messageEvent = new MessageEvent(this),
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
      .on('message', messageEvent.handle.bind(messageEvent))
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

  private async setupDatabase() {
    const V2tables = [
        V2RiderSchema,
        V2UserSchema,
        V2AddressSchema,
        V2JobSchema,
        V2TokensSchema,
        V2UserTokensSchema,
        V2ReferralSchema,
        V2NotificationsSchema,
        V2TransactionSchema,
        V2LoadRequestSchema,
        V2PromosSchema,
        V2MerchantSchema
      ],
      tables = [
        CustomerSchema,
        DeliveriesSchema,
        RiderSchema,
        RatesSchema,
        JobSchema,

        ...V2tables
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

  public async test() {
    await this.utils.createUser(
      {
        email: 'alexander.m9673@gmail.com',
        phone: '09456282634',

        fullName: 'Alex',
        pin: '9673'
      }
    )
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

  // perform user account tests
  public async tests() {
    const randEmail = await this.utils.genUID(4),
      randId = await this.utils.genUID(2),
      randomPhone = Math.floor(Math.random() * 999999999) + 1000000000,
      randomPin = Math.floor(Math.random() * 999) + 1000

    console.log('Call test()')

    // create user account
    await this.utils.user.create(
      {
        user: {
          email: randEmail + '@pasuyo.express',
          fullName: 'FirstName LastName - ' + randId,
          phone: randomPhone.toString(),
          pin: randomPin.toString()
        },
        rider: true
      }
    )
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
}

export default HttpServer
