import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2OptInLocation extends Path {
  public path = '/v2/rider/opt-in'
  public method = 'post'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const { status } = req.body as { status: boolean }

    return {
      value: await this.server.utils.rider.setOptIn(this.user.uid, !!status),
      code: 200
    }
  }
}

export default V2OptInLocation