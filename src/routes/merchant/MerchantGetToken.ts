import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class MerchantGetToken extends Path {
  public path = '/merchants/@me/token'
  public method = 'post'

  public async onRequest(req: ClientRequest) {
    const username = req.body<string>('username'),
      password = req.body<string>('password')

    return {
      value: await this.server.utils.merchant.getToken(username, password),
      code: 200
    }
  }
}

export default MerchantGetToken