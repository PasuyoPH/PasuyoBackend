import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserLikes extends Path {
  public path = '/users/@me/likes'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.merchant.getLikes(this.user.uid),
      code: 200
    }
  }
}

export default GetUserLikes