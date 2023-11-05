import Path from '../../base/Path'
import { AdminRoles } from '../../types/database/Admin'
import PathPermissions from '../../types/path/PathPermissions'

class AdminGetLoadRequests extends Path {
  public path = '/admin/loads'
  public permissions: PathPermissions = {
    check: 'admin',
    role: [AdminRoles.ACCOUNTING]
  }

  public async onRequest() {
    return {
      value: await this.server.utils.admins.getLoadRequests(),
      code: 200
    }
  }
}

export default AdminGetLoadRequests