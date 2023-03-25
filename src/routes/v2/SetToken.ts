import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

// set expo token
class V2SetToken extends Path {
  public path = '/v2/token/:token'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { token } = req.params as { token: string }

    return {
      value: await this.server.utils.addExpoToken(token, this.user.uid),
      code: 200
    }
  }
}

export default V2SetToken