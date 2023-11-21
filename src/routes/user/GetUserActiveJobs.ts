import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserActiveJobs extends Path {
  public method = 'get'
  public path = '/users/@me/active'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.users.getActiveJobs(this.user.uid),
      code: 200
    }
  }
}

export default GetUserActiveJobs