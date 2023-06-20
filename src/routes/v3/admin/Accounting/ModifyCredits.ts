import Path from '../../../../base/Path'
import { HttpReq } from '../../../../types/Http'
import { V3AdminRoles } from '../../../../types/v3/db/Admin'

class V3ModifyCredits extends Path {
  public path = '/v3/admin/accounting/credits/:uid'
  public method = 'patch'
  public admin = {
    check: true,
    role: [V3AdminRoles.ACCOUNTING, V3AdminRoles.ADMIN]
  }

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { credits } = req.body as { credits: number }

    return {
      value: await this.server.utils.rider.addCredits(uid, credits),
      code: 200
    }
  }
}

export default V3ModifyCredits