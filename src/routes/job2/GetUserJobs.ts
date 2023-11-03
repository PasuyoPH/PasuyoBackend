import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserJobs2 extends Path {
  public method = 'get'
  public path = '/jobs2'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.jobs2.getUserJobs(this.user.uid),
      code: 200
    }
  }
}

export default GetUserJobs2