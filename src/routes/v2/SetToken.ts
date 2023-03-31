import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'
import { V2UserRoles } from '../../types/v2/db/User'

// set expo token
class V2SetToken extends Path {
  public path = '/v2/token/:token'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { token } = req.params as { token: string },
      isRider = this.user.role === V2UserRoles.RIDER

    return {
      value: await this.server.utils.addExpoToken(token, this.user.uid, isRider),
      code: 200
    }
  }
}

export default V2SetToken