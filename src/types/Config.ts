interface IDatabaseConfig {
  host: string
  port: number | string

  user: string
  pass: string

  authSource: string
  dbName: string

  uri?: string
}

interface IHttpConfig {
  port: number
  cleanedJsonResponses: boolean

  base: string
}

interface ICaptchaConfig {
  sitekey: string
  secret: string
}

interface WebSocketConfig {
  address: string
  port: number
  
  name: string
  enabled: boolean

  interval: number
}

interface GoogleConfig {
  apikey: string
}

interface S3StorageData {
  url: string
}

interface S3Storage {
  [key: string]: S3StorageData
}

interface S3Config {
  endpoint: string
  accessKey: string
  secretKey: string
  region: string
  storages: S3Storage
}

interface XPConfig {
  unitPerDistance: number
  scale: number
}

interface PaypalConfig {
  client_id: string
  secret: string
}

interface PaymentMethodConfig {
  name: string
  image: string
  disabled?: boolean
  requireImage?: boolean
  hide?: string[] | string
}

interface IConfig {
  http: IHttpConfig
  debug: boolean
  apiVersion: string
  db: IDatabaseConfig
  adminKeys: string[]
  captcha: ICaptchaConfig
  cypher_iv_key: string
  jwt_secret: string
  maxMealsPerOrder: number
  ws: WebSocketConfig
  google: GoogleConfig
  s3: S3Config
  xp: XPConfig
  paypal: PaypalConfig
  payment_methods: PaymentMethodConfig[]
}

export {
  IDatabaseConfig,
  IHttpConfig,

  ICaptchaConfig,
  IConfig,

  WebSocketConfig
}