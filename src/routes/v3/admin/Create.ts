import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V3CreateAdmin extends Path {
  public method = 'post'
  public path = '/v3/admin'

  public async onRequest(req: HttpReq) {
    const { username, password } = req.body as { username: string, password: string }

    return {
      value: await this.server.utils.adminCreate(username, password),
      code: 200
    }
  }
}

export default V3CreateAdmin