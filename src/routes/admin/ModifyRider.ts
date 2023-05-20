import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'
import { V2Rider } from '../../types/v2/db/User'

class V2AdminModifyRider extends Path {
  public method = 'patch'
  public path   = '/v2/admin/rider/:uid'

  public async onRequest(req: HttpReq) {
    const data = req.body as any as V2Rider,
      { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.rider.modify(uid, data),
      code: 200
    }
  }
}

export default V2AdminModifyRider