import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantDeleteAddress extends Path {
  public method = 'delete'
  public path = '/merchants/@me/addresses/:uid'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')
    
    return {
      value: await this.server.utils.addresses.delete(uid, this.merchant.uid),
      code: 200
    }
  }
}

export default MerchantDeleteAddress