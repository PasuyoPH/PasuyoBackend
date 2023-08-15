import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

// Authenticate user
class AuthUser extends Path {
  public method = 'post'
  public path = '/auth/token'

  public async onRequest(req: ClientRequest) {
    const phone = req.body<string>('phone'),
      pin = req.body<string>('pin'),
      rider = req.body<boolean>('rider')

    console.log(req.req.body)

    return {
      value: await this.server.utils.users.toToken(phone, pin, rider),
      code: 200
    }
  }
}

export default AuthUser