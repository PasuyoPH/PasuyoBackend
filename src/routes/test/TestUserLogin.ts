import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

class UserLogin extends Path implements IRoute {
  public path   = '/tests/userlogin'
  public method = 'post'

  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { token } = req.body as any ?? '',
      user = await this.server.utils.getUserByToken(token)

    return {
      value: !!user,
      code: 200
    }
  }
}

export default UserLogin