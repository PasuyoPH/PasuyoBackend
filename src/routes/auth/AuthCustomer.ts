import Path from '../../base/Path'
import {
  HttpReq,
  IRoute
} from '../../types/Http'

import { IAuthUser } from '../../types/data'

class AuthCustomer extends Path implements IRoute {
  public method = 'post'
  public path   = '/auth/customer'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IAuthUser,
      token = await this.server.utils.getUserToken(data)

    return {
      value: token,
      code: 200
    }
  }
}

export default AuthCustomer