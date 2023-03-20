import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2UserRoles } from '../../../types/v2/db/User'
import V2HttpErrorCodes from '../../../types/v2/http/Codes'

class V2CompeleteJob extends Path {
  public path = '/v2/jobs/:uid/complete'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    if (this.user.role !== V2UserRoles.RIDER)
      throw new HttpError(
        V2HttpErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )

    // parse the image file to receive
    const result = await this.server.utils.parseFile(req)
    await this.server.utils.rider.completeJob(result, req.params.uid) // mark the job as complete

    return {
      value: null,
      code: 200
    }
  }
}

export default V2CompeleteJob