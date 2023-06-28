import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUser extends Path {
  public path = '/user'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: this.user,
      code: 200
    }
  }
}

export default GetUser