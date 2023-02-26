import Path from '../../../base/Path'
import { HttpReq, IRoute } from '../../../types/Http'

import { HttpUserData } from '../../../types/v2/http/User'

class AuthCreate extends Path implements IRoute {
  public method = 'post'
  public path   = '/v2/auth/create'

  public async onRequest(req: HttpReq) {
    const { user, rider } = req.body as unknown as HttpUserData,
      token = await this.server.utils.user.create(
        {
          user: user ?? {},
          rider
        }
      )

    return {
      value: token,
      code: 200
    }
  }
}

export default AuthCreate