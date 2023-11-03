import { getuid } from 'process'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserActiveDeliveries extends Path {
  public path = '/users/@me/active-deliveries'
  public method = 'get'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.deliveries.getActiveCount(this.user.uid),
      code: 200
    }
  }
}

export default GetUserActiveDeliveries