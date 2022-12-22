import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

class UserCreate extends Path implements IRoute {
  public path   = '/tests/createuser'
  public method = 'post'

  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { data } = req.body as any,
      user = await this.server.utils.createUserTest(!!data)

    return {
      value: user,
      code: 200
    }
  }
}

export default UserCreate