import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2Rider } from '../../../types/v2/db/User'

class V2GetRiderFee extends Path {
  public path = '/v2/jobs/:uid/fee'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.rider.calculateRiderFee(uid, this.user as V2Rider),
      code: 200
    }
  }
}

export default V2GetRiderFee