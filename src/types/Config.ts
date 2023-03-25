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

interface IConfig {
  http: IHttpConfig
  db: IDatabaseConfig
  adminKeys: string[]
  captcha: ICaptchaConfig
  cypher_iv_key: string
  jwt_secret: string
  maxMealsPerOrder: number
  ws: WebSocketConfig
  google: GoogleConfig
  s3: S3Config
}

export {
  IDatabaseConfig,
  IHttpConfig,

  ICaptchaConfig,
  IConfig,

  WebSocketConfig
}