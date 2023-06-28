import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import AuthCreateData from '../../types/http/AuthCreateData'

// Authenticate user
class AuthCreate extends Path {
  public method = 'post'
  public path = '/auth'

  public async onRequest(req: ClientRequest) {
    const data = req.body<AuthCreateData>('data'),
      rider = req.body<boolean>('rider')

    return {
      value: await this.server.utils.users.create(data, rider),
      code: 200
    }
  }
}

export default AuthCreate