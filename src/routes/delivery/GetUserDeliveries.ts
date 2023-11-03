import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserDeliveries extends Path {
  public method = 'get'
  public path = '/deliveries'
  public permissions: PathPermissions = {
    check: 'user'
  }
  
  public async onRequest() {
    return {
      value: await this.server.utils.deliveries.getDeliveries(this.user.uid),
      code: 200
    }
  }
}

export default GetUserDeliveries