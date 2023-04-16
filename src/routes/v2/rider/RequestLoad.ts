import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2RiderRequestLoad extends Path {
  public path = '/v2/rider/load'
  public method = 'post'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    // parse the image file to receive
    const result = await this.server.utils.parseFile(req)
    await this.server.utils.rider.requestLoad(result, this.user.uid)

    return {
      value: null,
      code: 200
    }
  }
}

export default V2RiderRequestLoad