import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2Rider, V2UserRoles } from '../../../types/v2/db/User'
import { V2HttpCalculateDistance } from '../../../types/v2/http/CalculateDistance'

class V2CalculateDistance extends Path {
  public path   = '/v2/distance'
  public method = 'post'

  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    const { points } = req.body as unknown as V2HttpCalculateDistance

    return {
      value: await this.server.utils.user.calculateDistance(
        points,
        this.user.role === V2UserRoles.RIDER ?
          this.user as V2Rider :
          null
      ),
      code: 200
    }
  }
}

export default V2CalculateDistance