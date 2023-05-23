import Path from '../../../../base/Path'
import { HttpReq } from '../../../../types/Http'

class V2GetProducts extends Path {
  public path = '/v2/merchants/:uid/products'

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.getMerchantProducts(uid),
      code: 200
    }
  }
}

export default V2GetProducts