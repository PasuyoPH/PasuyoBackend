import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

// this will fetch the current item & merchant info
class GetMerchantItem extends Path {
  public method = 'get'
  public path = '/items/:uid'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.getItem(uid),
      code: 200
    }
  }
}

export default GetMerchantItem