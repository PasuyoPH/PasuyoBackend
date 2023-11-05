import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantGetOrders extends Path {
  public path = '/merchant/@me/orders'
  public method = 'get'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.merchant.getOrders(this.merchant),
      code: 200
    }
  }
}

export default MerchantGetOrders