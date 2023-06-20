import Path from '../../../../base/Path'
import { HttpReq } from '../../../../types/Http'
import { V3AdminRoles } from '../../../../types/v3/db/Admin'

class V3VerifyRider extends Path {
  public path = '/v3/admin/verifyer/verify/:uid'
  public method = 'post'
  public admin = {
    check: true,
    role: [V3AdminRoles.VERIFYER, V3AdminRoles.ADMIN]
  }

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.verifyRider(uid),
      code: 200
    }
  }
}

export default V3VerifyRider