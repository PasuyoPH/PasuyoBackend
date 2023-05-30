import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import axios from 'axios'

class V2TestPushNotif extends Path {
  public path = '/v2/tests/pushnotif/:expoPushToken'
  public adminOnly = true

  public async onRequest(req: HttpReq) {    
    await this.server.expo.sendPushNotificationsAsync(
      [
        {
          to: req.params.expoPushToken ?? '',
          channelId: 'default',
          title: 'New Order!',
          body: 'A new order has arrived.',
          categoryId: 'new_job',
          data: {
            jobID: 'TEST_JOB_ID'
          }
        }
      ]
    )

    return { code: 200 }
  }
}

export default V2TestPushNotif