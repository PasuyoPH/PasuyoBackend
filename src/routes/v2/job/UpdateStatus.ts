import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2JobStatus } from '../../../types/v2/db/Job'

class V2UpdateStatus extends Path {
  public path = '/v2/jobs/:uid'
  public method = 'patch'

  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { status } = req.body as { status: V2JobStatus }

    return {
      value: await this.server.utils.rider.updateJobStatus(this.user.uid, uid, status),
      code: 200
    }
  }
}

export default V2UpdateStatus