import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetAdminToken extends Path {
  public path = '/admin/@me/token'
  public method = 'post'

  public async onRequest(req: ClientRequest) {
    const username = req.body<string>('username'),
      password = req.body<string>('password')

    return {
      value: await this.server.utils.admins.getAdminToken(username, password),
      code: 200
    }
  }
}

export default GetAdminToken