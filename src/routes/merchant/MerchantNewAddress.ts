import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import NewAddressData from '../../types/http/NewAddressData'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantNewAddress extends Path {
  public method = 'post'
  public path = '/merchant/@me/addresses'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const data = req.body<NewAddressData>('address')
    
    return {
      value: await this.server.utils.merchant.newAddress(data, this.merchant),
      code: 200
    }
  }
}

export default MerchantNewAddress