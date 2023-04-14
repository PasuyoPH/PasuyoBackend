import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2AddNotification extends Path {
  public method = 'post'
  public path = '/v2/notifications'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { title, body } = req.body as { title: string, body: string }

    return {
      value: await this.server.utils.user.addNotification(this.user.uid, title, body),
      code: 200
    }
  }
}

export default V2AddNotification