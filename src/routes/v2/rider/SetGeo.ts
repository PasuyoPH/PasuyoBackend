import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { Geo } from '../../../types/v2/Geo'

class V2SetGeo extends Path {
  public path = '/v2/rider/geo'
  public method = 'post'

  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const geo = req.body as any as Geo

    return {
      value: await this.server.utils.rider.updateRiderGeo(this.user.uid, geo),
      code: 200
    }
  }
}

export default V2SetGeo