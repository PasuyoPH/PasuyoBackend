import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserJobs extends Path {
  public path = '/users/@me/jobs'
  public permissions: PathPermissions = {
    check: 'user'
  }
  
  public async onRequest() {
    return {
      value: await this.server.utils.jobs.getUserJobs(this.user.uid),
      code: 200
    }
  }
}

export default GetUserJobs