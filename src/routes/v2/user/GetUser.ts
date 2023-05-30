import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

// get limited user info
class V2GetUser extends Path {
  public path = '/v2/user/:uid'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { rider } = req.query as { rider: string }

    return {
      value: await this.server.utils.user.getUser(uid, rider === 'true'),
      code: 200
    }
  }
}

export default V2GetUser