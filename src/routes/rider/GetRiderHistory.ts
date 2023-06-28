import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetRiderHistory extends Path {
  public path = '/riders/@me/history'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest() {
    return {
      value: await this.server.utils.riders.getRiderHistory(this.rider.uid),
      code: 200
    }
  }
}

export default GetRiderHistory