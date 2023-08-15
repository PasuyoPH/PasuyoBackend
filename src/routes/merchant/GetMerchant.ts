import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetMerchant extends Path {
  public method = 'get'
  public path = '/merchant/:uid'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.get(uid),
      code: 200
    }
  }
}

export default GetMerchant