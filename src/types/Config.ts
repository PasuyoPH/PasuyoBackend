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
}

export {
  IDatabaseConfig,
  IHttpConfig,

  ICaptchaConfig,
  IConfig,

  WebSocketConfig
}