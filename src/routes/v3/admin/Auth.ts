import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V3AuthAdmin extends Path {
  public method = 'post'
  public path = '/v3/admin/auth'

  public async onRequest(req: HttpReq) {
    const { username, password } = req.body as { username: string, password: string }

    return {
      value: await this.server.utils.adminAuth(username, password),
      code: 200
    }
  }
}

export default V3AuthAdmin