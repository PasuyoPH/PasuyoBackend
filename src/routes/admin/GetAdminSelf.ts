import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetAdminSelf extends Path {
  public path = '/admin/@me'
  public permissions: PathPermissions = {
    check: 'admin',
    role: []
  }

  public async onRequest() {
    return {
      value: this.admin,
      code: 200
    }
  }
}

export default GetAdminSelf