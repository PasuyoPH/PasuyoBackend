import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2DeleteDraft extends Path {
  public method = 'delete'
  public path = '/v2/drafts/:uid'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.user.deleteDraft(this.user.uid, uid),
      code: 200
    }
  }
}

export default V2DeleteDraft