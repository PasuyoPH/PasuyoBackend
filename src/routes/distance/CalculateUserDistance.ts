import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { Geo } from '../../types/database/Address'
import PathPermissions from '../../types/path/PathPermissions'

// calculate distances between points as a user
class CalculateUserDistance extends Path {
  public method = 'post'
  public path = '/distance/user'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const points = req.body<Geo[]>('points')
    return {
      value: await this.server.utils.math.calculateDistance(points),
      code: 200
    }
  }
}

export default CalculateUserDistance