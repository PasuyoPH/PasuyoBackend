import {
  HttpReq,
  HttpRes,
  PathReturnable,
} from '../types/Http'
import HttpServer from './HttpServer'

// Reworked
import PathPermissions from '../types/path/PathPermissions'
import { CustomError, PathReturnObject } from '../types/path/PathReturnable'
import Admin from '../types/database/Admin'
import HttpError from './HttpError'
import HttpErrorCodes from '../types/ErrorCodes'
import ClientRequest from './ClientRequest'
import User from '../types/database/User'
import { Rider } from '../types/database/Rider'

class Path {
  public path   = '/'
  public method = 'get'

  //public adminOnly = false
  public server: HttpServer

  //public deflate = promisify(zlib.deflate)
  //public inflate = promisify(zlib.inflate)

  //public cache = false
  //public captcha = false

  //public requireUserToken = false
  //public mustBeVerifiedRider = false

  //public adminUser: V3Admin = null

  // Reworked
  public permissions: PathPermissions = null
  private _user: User | Admin | Rider = null // To be filled with data if requested permissions
  private _token = null // To be filled with user token data if requested permissions

  private clean(data: PathReturnObject | CustomError) {
    return this.server.config.http.cleanedJsonResponses ?
      JSON.stringify(data, null, 2) :
      JSON.stringify(data)
  }

  public register(server: HttpServer) {
    const pathBase = this.server.config.http.base.startsWith('/') ?
      this.server.config.http.base :
      '/'

    this.server = server

    server.restana[this.method](
      pathBase + this.path,
      async (req: HttpReq, res: HttpRes) => {
        const clientRequest = new ClientRequest(req)

        if (this.server.config.debug)
          await this.server.log('[DEBUG]: Called:', this.path, 'with method:', this.method.toUpperCase())

        try {
          if (this.permissions) { // check for permissions
            const token = req.headers.authorization
            this._token = token

            switch (this.permissions.check) {
              case 'user':
                const user = await this.server.utils.users.fromToken<User>(token, 'user')
                if (!user)
                  throw new HttpError(
                    HttpErrorCodes.AUTH_INVALID_TKN,
                    'Invalid user token provided. Please try again.'
                  )

                this._user = user
                break

              case 'rider':
                const rider = await this.server.utils.users.fromToken<Rider>(token, 'rider')
                if (!rider)
                  throw new HttpError(
                    HttpErrorCodes.AUTH_INVALID_TKN,
                    'Invalid rider token provided. Please try again.'
                  )

                if (this.permissions.verified && !rider.verified)
                  throw new HttpError(
                    HttpErrorCodes.RIDER_NOT_VERIFIED,
                    'Please make sure that you are verified before proceeding.'
                  )

                this._user = rider
                break

              case 'admin': // get admin data
                const admin = await this.server.utils.users.fromToken<Admin>(token, 'admin')
                if (!admin)
                  throw new HttpError(
                    HttpErrorCodes.ADMIN_INVALID_TOKEN,
                    'Invalid admin token provided. Please try again.'
                  )

                if (!Array.isArray(this.permissions.role))
                  this.permissions.role = []

                if (
                  this.permissions.role.length >= 1 &&
                  !this.permissions.role.includes(admin.role)
                )
                  throw new HttpError(
                    HttpErrorCodes.ADMIN_INVALID_PERMISSIONS,
                    'You have insufficient permissions for this action.'
                  )

                this._user = admin
                break

              default: ''
                break
            }
          }

          const result = await this.onRequest(clientRequest, res) as PathReturnObject
          return res.send(
            this.clean(
              result ?? { code: 200 }
            )
          )
        } catch(err) {
          if (this.server.config.debug)
            console.log('[ERROR]:', err)

          if (err.code === '42703' || err.code === 42703) { // knex related or pgsql
            res.statusCode = 400

            return res.send(
              this.clean(
                {
                  error: true,
                  code: HttpErrorCodes.INVALID_FIELDS,
                  message: 'Invalid fields provided. (' +
                    (err.message ?? 'No message provided.') + ')'
                }
              )
            )
          }

          const code = err.code && err.code >= 900 ?
            400 :
            err.code ?? 500,
            message = err.isAxiosError ?
              'Internal API Error. Please contact admins about this.' :
              err.message ?? 'Unknown error.'

          res.statusCode = isNaN(code) ? 400 : code

          return res.send(
            this.clean(
              {
                error: true,
                code: err.code ?? 500,
                message
              }
            )
          )
        }
      }
    )
  }

  public async onRequest(_req: ClientRequest, _res: HttpRes): Promise<PathReturnable | void> {}

  public get admin() {
    return this._user as Admin
  }

  public get user() {
    return this._user as User
  }
  
  public get rider() {
    return this._user as Rider
  }

  public get token() {
    return this._token
  }
}

export default Path