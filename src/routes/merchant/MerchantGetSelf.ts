import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantGetSelf extends Path {
  public path = '/merchants/@me/self'
  public method = 'get'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest() {
    console.log(this.merchant)

    return {
      value: this.merchant,
      code: 200
    }
  }
}

export default MerchantGetSelf