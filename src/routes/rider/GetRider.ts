import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetRider extends Path {
  public path = '/rider'
  public permissions: PathPermissions = {
    check: 'rider'
  }

  public async onRequest() {
    return {
      value: this.rider,
      code: 200
    }
  }
}

export default GetRider