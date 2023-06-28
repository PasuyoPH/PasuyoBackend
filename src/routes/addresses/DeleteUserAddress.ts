import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class DeleteUserAddress extends Path {
  public method = 'delete'
  public path = '/addresses/:uid'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.addresses.delete(uid, this.user.uid),
      code: 200
    }
  }
}

export default DeleteUserAddress