import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

// delete expo token
class V2DeleteToken extends Path {
  public path = '/v2/token/:token'
  public method = 'delete'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { token } = req.params as { token: string }

    return {
      value: await this.server.utils.deleteExpoToken(token, this.user.uid),
      code: 200
    }
  }
}

export default V2DeleteToken