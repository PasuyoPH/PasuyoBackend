import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

// get limited user info
class V2GetUser extends Path {
  public path = '/v2/user/:uid'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: this.server.utils.user.getUser(uid),
      code: 200
    }
  }
}

export default V2GetUser