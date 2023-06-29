import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AdminGetRiders extends Path {
  public path = '/admin/riders'
  public permissions: PathPermissions = {
    check: 'admin'
  }
  
  public async onRequest() {
    return {
      value: await this.server.utils.admins.getRiders(),
      code: 200
    }
  }
}

export default AdminGetRiders