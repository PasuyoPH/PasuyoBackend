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

export {
  HttpReq,
  HttpRes,

  PathReturnable,
  IRoute,

  IPathReturnObject,
  IEncryptedToken
}