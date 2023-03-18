import HttpError from '../../../base/HttpError'
import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2UserRoles } from '../../../types/v2/db/User'
import V2HttpErrorCodes from '../../../types/v2/http/Codes'

class V2GetAddressesById extends Path {
  public path = '/v2/addresses/:ids' // id format: id,id,id,id
  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    if (this.user.role !== V2UserRoles.RIDER)
      throw new HttpError(
        V2HttpErrorCodes.USER_NOT_RIDER,
        'Method not allowed. User must be a rider'
      )
    
    const ids = (req.params.ids as string)
      .split(',')

    return {
      value: await this.server.utils.rider.getAddressesById(ids),
      code: 200
    }
  }
}

export default V2GetAddressesById