import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserDrafts extends Path {
  public path = '/users/@me/drafts'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.jobs2.getUserJobs(this.user.uid, true),
      code: 200
    }
  }
}

export default GetUserDrafts