import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

class V2VerifyRider extends Path {
  public path = '/v2/admin/rider/:uid'
  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.verifyRider(uid),
      code: 200
    }
  }
}

export default V2VerifyRider