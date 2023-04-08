import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

// get all addresses related to a job
class V2GetJobAddress extends Path {
  public path = '/v2/jobs/:uid/addresses'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }
    
    return {
      value: await this.server.utils.rider.getJobAddresses(uid),
      code: 200
    }
  }
}

export default V2GetJobAddress