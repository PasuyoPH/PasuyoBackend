import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AdminGetStats extends Path {
  public path = '/admin/stats'
  public permissions: PathPermissions = {
    check: 'admin'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.admins.getStats(),
      code: 200
    }
  }
}

export default AdminGetStats