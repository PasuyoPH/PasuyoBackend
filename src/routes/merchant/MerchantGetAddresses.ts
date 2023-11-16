import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantGetAddresses extends Path {
  public method = 'get'
  public path = '/merchants/@me/addresses'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.merchant.getAddresses(this.merchant.uid),
      code: 200
    }
  }
}

export default MerchantGetAddresses