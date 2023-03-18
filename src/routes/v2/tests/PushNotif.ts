import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import axios from 'axios'

class V2TestPushNotif extends Path {
  public path = '/v2/tests/pushnotif/:expoPushToken'

  public async onRequest(req: HttpReq) {
    const url = 'https://exp.host/--/api/v2/push/send'
    axios(
      {
        method: 'post',
        url,
        data: {
          to: req.params.expoPushToken ?? '',
          channelId: 'default',
          title: 'Pasuyo Test Notification',
          body: 'This notificaiton is just for testing only. #PasuyoKana'
        }
      }
    )

    return { code: 200 }
  }
}

export default V2TestPushNotif