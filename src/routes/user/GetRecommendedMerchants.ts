import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetRecommendedMerchants extends Path {
  public path = '/users/@me/merchants'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.users.getRecommendedMerchants(this.user.uid),
      code: 200
    }
  }
}

export default GetRecommendedMerchants