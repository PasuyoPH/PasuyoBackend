import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetMerchant extends Path {
  public path = '/v2/merchant/:uid'

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.getMerchant(uid),
      code: 200
    }
  }
}

export default V2GetMerchant