import ClientRequest from "../../base/ClientRequest"
import Path from "../../base/Path"

// This would get different statistics of a merchant, such as their data, likes, tags, items, etc...
class GetMerchantData extends Path {
  public path = '/merchant/:uid/data'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.getMerchantData(uid),
      code: 200
    }
  }
}

export default GetMerchantData