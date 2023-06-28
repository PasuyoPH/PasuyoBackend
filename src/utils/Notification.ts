import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import Notification from '../types/database/Notifications'
import NewNotificationData from '../types/http/NewNotificationData'

class NotificationUtils {
  constructor(public server: HttpServer) {}

  public async getUserNotifs(uid: string) {
    return await this.server.db.table<Notification>(Tables.Notifications)
      .select('*')
      .where('user', uid)
  }

  public async save(notification: NewNotificationData, user: string) {
    const data = {
      title: notification.title,
      body: notification.body,
      user,
      receivedAt: Date.now(),
      uid: await this.server.utils.crypto.genUID()
    }
    
    await this.server.db.table<Notification>(Tables.Notifications)
      .insert(data)

    return data
  }
}

export default NotificationUtils