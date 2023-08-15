import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetMerchants extends Path {
  public method = 'get'
  public path = '/merchants'

  public async onRequest(req: ClientRequest) {
    const ids = (req.query('ids') as string ?? '')
      .split(',')      

    return {
      value: ids.length >= 1 ?
        await this.server.utils.merchant.getMerchantsById(ids) :
        await this.server.utils.merchant.getMerchants(),
      code: 200
    }
  }
}

export default GetMerchants