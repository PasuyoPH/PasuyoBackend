import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserJobAddresses extends Path {
  public path = '/users/@me/job-addresses/:uid'
  public method = 'get'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.users.getUserJobAddresses(uid),
      code: 200
    }
  }
}

export default GetUserJobAddresses