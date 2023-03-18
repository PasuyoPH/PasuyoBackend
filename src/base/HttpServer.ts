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
        V2JobSchema
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
}

export default HttpServer
