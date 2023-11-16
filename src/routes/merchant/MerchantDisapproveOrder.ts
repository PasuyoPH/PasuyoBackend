import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantDisapproveOrder extends Path {
  public method = 'post'
  public path = '/merchants/@me/disapprove/:uid'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.disapprove(uid),
      code: 200
    }
  }
}

export default MerchantDisapproveOrder