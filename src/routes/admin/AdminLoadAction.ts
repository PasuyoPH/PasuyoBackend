import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { AdminRoles } from '../../types/database/Admin'
import PathPermissions from '../../types/path/PathPermissions'

class AdminLoadAction extends Path {
  public path = '/admin/loads/:uid'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'admin',
    role: [AdminRoles.ACCOUNTING]
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      approved = req.body<boolean>('approved')

    return {
      value: await this.server.utils.admins.approveLoadAction(uid, approved),
      code: 200
    }
  }
}

export default AdminLoadAction