import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantGetItems extends Path {
  public path = '/merchants/@me/items'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest() {
    console.log('ID:', this.merchant.uid)

    return {
      value: await this.server.utils.merchant.getItems(this.merchant.uid),
      code: 200
    }
  }
}

export default MerchantGetItems