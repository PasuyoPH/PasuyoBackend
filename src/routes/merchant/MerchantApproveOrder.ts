import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantApproveOrder extends Path {
  public method = 'post'
  public path = '/merchants/@me/approve/:uid'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.approve(this.merchant, uid),
      code: 200
    }
  }
}

export default MerchantApproveOrder