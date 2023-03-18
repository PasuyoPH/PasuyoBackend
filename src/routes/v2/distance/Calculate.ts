import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2HttpCalculateDistance } from '../../../types/v2/http/CalculateDistance'

class V2CalculateDistance extends Path {
  public path   = '/v2/distance'
  public method = 'post'

  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    const { points } = req.body as unknown as V2HttpCalculateDistance

    return {
      value: await this.server.utils.user.calculateDistance(points),
      code: 200
    }
  }
}

export default V2CalculateDistance