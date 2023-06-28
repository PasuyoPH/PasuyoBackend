import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetRiderCurrentJob extends Path {
  public path = '/riders/@me/jobs/current'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest() {
    return {
      value: await this.server.utils.riders.getCurrentJob(this.rider.uid),
      code: 200
    }
  }
}

export default GetRiderCurrentJob