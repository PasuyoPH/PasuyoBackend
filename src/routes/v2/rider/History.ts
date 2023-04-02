import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetRiderHistory extends Path {
  public path = '/v2/rider/history'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    return {
      value: await this.server.utils.rider.getHistory(this.user.uid),
      code: 200
    }
  }
}

export default V2GetRiderHistory