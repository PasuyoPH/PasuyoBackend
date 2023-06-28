import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

// (UNUSED)
class GetRiderJobs extends Path {
  public path = '/riders/@me/jobs'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest() {
    return {
      value: await this.server.utils.riders.getRiderJobs(this.rider.uid),
      code: 200
    }
  }
}

export default GetRiderJobs