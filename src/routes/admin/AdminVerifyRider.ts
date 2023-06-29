import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AdminVerifyRider extends Path {
  public method = 'post'
  public path = '/admin/rider/verify'
  public permissions: PathPermissions = {
    check: 'admin'
  }
  
  public async onRequest(req: ClientRequest) {
    const rider = req.body<string>('rider')

    return {
      value: await this.server.utils.admins.verifyRider(rider),
      code: 200
    }
  }
}

export default AdminVerifyRider