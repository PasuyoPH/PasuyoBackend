import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

// (UNUSED)
class GetRiderStats extends Path {
  public path = '/riders/@me/stats'
  public permissions: PathPermissions = {
    check: 'rider',
    //verified: true
  }

  public async onRequest() {
    return {
      value: await this.server.utils.riders.getRiderStats(this.rider.uid),
      code: 200
    }
  }
}

export default GetRiderStats