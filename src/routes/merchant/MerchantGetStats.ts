import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantGetStats extends Path {
  public path = '/merchant/@me/stats'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.merchant.getStats(this.merchant),
      code: 200
    }
  }
}

export default MerchantGetStats