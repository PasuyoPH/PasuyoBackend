import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

class V2AdminModifyCredits extends Path {
  public path   = '/v2/admin/credits/:uid'
  public method = 'patch'
  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { credits } = req.body as { credits: number }

    return {
      value: await this.server.utils.rider.addCredits(uid, credits),
      code: 200
    }
  }
}

export default V2AdminModifyCredits