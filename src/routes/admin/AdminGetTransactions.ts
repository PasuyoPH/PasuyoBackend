import Path from '../../base/Path'
import { AdminRoles } from '../../types/database/Admin'
import PathPermissions from '../../types/path/PathPermissions'

class AdminGetTransactions extends Path {
  public path = '/admin/transactions'
  public permissions: PathPermissions = {
    check: 'admin',
    role: [AdminRoles.ACCOUNTING]
  }

  public async onRequest() {
    return {
      value: await this.server.utils.admins.getTransactions(),
      code: 200
    }
  }
}

export default AdminGetTransactions