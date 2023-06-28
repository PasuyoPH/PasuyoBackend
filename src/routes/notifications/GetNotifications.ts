import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetNotifications extends Path {
  public path = '/notifications'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest() {
    return {
      value: await this.server.utils.notifications.getUserNotifs(this.user.uid),
      code: 200
    }
  }
}

export default GetNotifications