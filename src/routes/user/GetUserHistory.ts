import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserHistory extends Path {
  public path = '/users/@me/history'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.jobs.getHistory(this.user.uid),
      code: 200
    }
  }
}

export default GetUserHistory