import HttpError from '../../base/HttpError'
import Path from '../../base/Path'
import IRateRider from '../../types/data/RateRider'

import {
  HttpReq,
  IErrorCodes,
  IRoute
} from '../../types/Http'

class RateRider extends Path implements IRoute {
  public path   = '/rate/:uid'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as IRateRider
    if (Object.hasOwn(this.user, 'verified'))
      throw new HttpError(
        IErrorCodes.RATING_RIDER_CUSTOMER_ONLY,
        'This route is for customers only. Riders are not allowed to send requests here.'
      )

    return {
      value: await this.server.utils.rateRider(
        this.user.uid,
        req.params.uid,
        data
      ),
      code: 200
    }
  }
}

export default RateRider