import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserAddresses extends Path {
  public path = '/addresses'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.addresses.getUserAddresses(this.user.uid),
      code: 200
    }
  }
}

export default GetUserAddresses