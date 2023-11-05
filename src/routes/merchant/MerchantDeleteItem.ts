import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantDeleteItem extends Path {
  public method = 'delete'
  public path = '/merchant/@me/items/:uid'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.deleteItem(
        this.merchant,
        uid
      ),
      code: 200
    }
  }
}

export default MerchantDeleteItem