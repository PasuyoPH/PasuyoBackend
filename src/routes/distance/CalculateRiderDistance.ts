import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { Geo } from '../../types/database/Address'
import PathPermissions from '../../types/path/PathPermissions'

// calculate distances between points as a rider
class CalculateRiderDistance extends Path {
  public method = 'post'
  public path = '/distance/rider'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const points = req.body<Geo[]>('points')
    return {
      value: await this.server.utils.math.calculateDistance(points, this.rider),
      code: 200
    }
  }
}

export default CalculateRiderDistance