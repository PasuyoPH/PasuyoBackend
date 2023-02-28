import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

import V2Auth from '../../../types/v2/http/Auth'

class V2AuthUser extends Path {
  public method = 'post'
  public path   = '/v2/auth'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as V2Auth,
      token = await this.server.utils.user.token(data)

    return {
      value: token,
      code: 200
    }
  }
}

export default V2AuthUser