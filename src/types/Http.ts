import { IncomingMessage, ServerResponse } from 'http'
import { RequestExtensions, ResponseExtensions } from 'restana'

type HttpReq = IncomingMessage & RequestExtensions
type HttpRes = ServerResponse & ResponseExtensions

interface IPathReturnObject {
  error?: boolean
  code?: number

  message?: string
  value?: any

  willPipe?: boolean
  userTokenInvalid?: boolean
}

type PathReturnable = number | string | IPathReturnObject | any[]

interface IRoute {
  path: string
  method: string
}

interface IEncryptedToken {
  iv: string
  token: string
}

interface ICustomError {
  code: number,
  msg: string
}

enum IErrorCodes {
  // General Error
  INVALID_FIELDS = 900,

  // Auth Related error codes
  AUTH_DUPL          = 1000,
  AUTH_FAILED        = 1001,
  AUTH_INVALID_PIN   = 1002,
  AUTH_INVALID_TKN   = 1003,
  AUTH_INVALID_EMAIL = 1004,

  // Delivery Related error codes
  DELIVERY_MISSING_DATA = 2000,
  DELIVERY_INVALID_ITEM = 2001,

  // Rider related codes
  RIDER_NOT_VERIFIED = 3000,
  USER_NOT_RIDER     = 3001,

  // Rating related codes
  RATING_RATE_INVALID        = 4000,
  RATING_COMMENT_TOO_SHORT   = 4001,
  RATING_COMMENT_TOO_LONG    = 4002,
  RATING_RIDER_CUSTOMER_ONLY = 4003,
  RATING_RIDER_NOT_EXIST     = 4004,

  // Job related codes
  JOB_INVALID_TYPE           = 5000,

  // SetGeo related codes
  SET_GEO_INVALID_RIDER_ID = 6001,
  SET_GEO_INVALID_GEOMETRY = 6002,
}

export {
  HttpReq,
  HttpRes,

  PathReturnable,
  IRoute,

  IPathReturnObject,
  IEncryptedToken,

  IErrorCodes,
  ICustomError
}