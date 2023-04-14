import Path from '../../../base/Path'

// gets all user notifications
class V2GetNotifications extends Path {
  public path = '/v2/notifications'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.user.getNotifications(this.user.uid),
      code: 200
    }
  }
}

export default V2GetNotifications