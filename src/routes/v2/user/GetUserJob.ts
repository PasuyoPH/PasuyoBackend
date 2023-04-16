import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetUserJob extends Path {
  public path = '/v2/user/jobs/:uid'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.user.getUserJob(this.user.uid, uid),
      code: 200
    }
  }
}

export default V2GetUserJob