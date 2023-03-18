import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2HttpCalculateDistance } from '../../../types/v2/http/CalculateDistance'

// calculate fee
class V2CalculateFee extends Path {
  public path   = '/v2/fee'
  public method = 'post'  

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { points } = req.body as unknown as V2HttpCalculateDistance
  }
}

export default V2CalculateFee