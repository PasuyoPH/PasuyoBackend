import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

import V2HttpAddressData from '../../../types/v2/http/Address'

class V2NewAddress extends Path {
  public path   = '/v2/addresses'
  public method = 'post'

  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as V2HttpAddressData

    return {
      value: await this.server.utils.user.newAddress(this.user.uid, data),
      code: 200
    }
  }
}

export default V2NewAddress