import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'

import { HttpReq, IErrorCodes } from '../../../types/Http'
import { V2UserRoles } from '../../../types/v2/db/User'

import GeoCacheData from '../../../types/v2/Geo'

class V2SetGeo extends Path {
  public path = '/v2/rider/geo'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    if (this.user.role !== V2UserRoles.RIDER)
      throw new HttpError(
        IErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )

    const { data }: { data: GeoCacheData } = req.body as any
    return {
      value: this.server.utils.rider.setRiderGeo(data),
      code: 200
    }
  }
}

export default V2SetGeo