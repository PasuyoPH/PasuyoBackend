import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetJobMap extends Path {
  public method = 'get'
  public path = '/jobs2/map'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest() {
    return {
      value: await this.server.utils.jobs2.getMap(this.rider.uid),
      code: 200
    }
  }
}

export default GetJobMap