import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'

import { IErrorCodes, IRoute } from '../../../types/Http'

class GetJobs extends Path implements IRoute {
  public path = '/v2/rider/jobs'
  public requireUserToken = true

  public async onRequest() {
    if (this.user.role !== 'RIDER')
      throw new HttpError(
        IErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )

    return {
      value: await this.server.utils.rider.getJobs(),
      code: 200
    }
  }
}

export default GetJobs