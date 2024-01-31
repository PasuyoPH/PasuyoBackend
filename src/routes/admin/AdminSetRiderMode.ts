import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AdminSetRiderMode extends Path {
  public path = '/admin/mode/:uid'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'admin'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      mode = req.body<number>('mode')

    return {
      value: await this.server.utils.admins.setRiderMode(uid, mode)
    }
  }
}

export default AdminSetRiderMode