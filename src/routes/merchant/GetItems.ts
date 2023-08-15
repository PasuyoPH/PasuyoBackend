import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetMerchantItems extends Path {
  public method = 'get'
  public path = '/merchant/:uid/items'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.getItems(uid),
      code: 200
    }
  }
}

export default GetMerchantItems