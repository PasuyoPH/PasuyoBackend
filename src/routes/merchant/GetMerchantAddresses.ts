import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetMerchantAddresses extends Path {
  public method = 'get'
  public path = '/merchant/@me/addresses'

  // todo: add merchant auth
  public async onRequest(req: ClientRequest) {
    return {
      value: await this.server.utils.merchant.getAddresses('1'),
      code: 200
    }
  }
}

export default GetMerchantAddresses