import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AdminGetMerchants extends Path {
  public path = '/admin/merchants'
  public method = 'get'
  public permissions: PathPermissions = {
    check: 'admin'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.admins.getMerchants(),
      code: 200
    }
  }
}

export default AdminGetMerchants