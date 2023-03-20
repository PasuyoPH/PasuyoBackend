import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'
import { IRoute } from '../../../types/Http'
import { V2UserRoles } from '../../../types/v2/db/User'
import V2HttpErrorCodes from '../../../types/v2/http/Codes'

class GetJobs extends Path implements IRoute {
  public path = '/v2/rider/jobs'
  public requireUserToken = true

  public async onRequest() {
    if (this.user.role !== V2UserRoles.RIDER)
      throw new HttpError(
        V2HttpErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )

    return {
      value: await this.server.utils.rider.getJobs(this.user.uid),
      code: 200
    }
  }
}

export default GetJobs