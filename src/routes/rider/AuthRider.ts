import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

import { IAuthUser } from '../../types/data'

class AuthRider extends Path implements IRoute {
  public method = 'post'
  public path   = '/rider/auth'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IAuthUser,
      token = await this.server.utils.getUserToken(data, true)

    return {
      value: token,
      code: 200
    }
  }
}

export default AuthRider