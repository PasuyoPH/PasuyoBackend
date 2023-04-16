import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

class V2ApproveCredits extends Path {
  public method = 'post'
  public path = '/v2/admin/approve/:uid'
  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { credits } = req.body as { credits: number }

    return { 
      value: await this.server.utils.approveLoad(uid, credits), // uid is load request uid
      code: 200
    }
  }
}

export default V2ApproveCredits