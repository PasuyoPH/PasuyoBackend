import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import NewNotificationData from '../../types/http/NewNotificationData'
import PathPermissions from '../../types/path/PathPermissions'

class SaveNotification extends Path {
  public method = 'post'
  public path = '/notifications'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const notification = req.body<NewNotificationData>('notification')

    return {
      value: await this.server.utils.notifications.save(notification, this.user.uid),
      code: 200
    }
  }
}

export default SaveNotification