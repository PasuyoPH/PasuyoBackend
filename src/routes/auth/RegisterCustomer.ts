import Path from '../../base/Path'
import { INewUser } from '../../types/data'

import {
  HttpReq,
  IRoute
} from '../../types/Http'

class RegisterCustomer extends Path implements IRoute {
  public method = 'post'
  public path   = '/auth/customer/new'

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as INewUser,
      token = await this.server.utils.createUser(data)

    return {
      value: token,
      code: 200
    }
  }
}

export default RegisterCustomer