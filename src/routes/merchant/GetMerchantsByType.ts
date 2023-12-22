import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetMerchantsByType extends Path {
  public path = '/merchants-type/:type'

  public async onRequest(req: ClientRequest) {
    const type = req.params('type')

    return {
      value: await this.server.utils.merchant.getMerchantsByType(
        Number(type)
      ),
      code: 200
    }
  }
}

export default GetMerchantsByType