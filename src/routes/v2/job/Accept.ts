import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2Rider, V2UserRoles } from '../../../types/v2/db/User'
import V2HttpErrorCodes from '../../../types/v2/http/Codes'

class V2AcceptJob extends Path {
  public path = '/v2/jobs/:uid/accept'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    if (this.user.role !== V2UserRoles.RIDER)
      throw new HttpError(
        V2HttpErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )

    return {
      value: await this.server.utils.rider.acceptJob(this.user as V2Rider, req.params.uid),
      code: 200
    }
  }
}

export default V2AcceptJob