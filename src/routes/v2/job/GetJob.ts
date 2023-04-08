import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetJob extends Path { // for some reason i forgot to implement this?
  public path = '/v2/jobs/:uid'
  public method = 'get'

  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.rider.getJob(uid),
      code: 200
    }
  }
}

export default V2GetJob