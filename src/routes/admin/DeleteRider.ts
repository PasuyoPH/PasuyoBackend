import Path from '../../base/Path'
import { HttpReq } from '../../types/Http'

class V2AdminDeleteRider extends Path {
  public method = 'delete'
  public path   = '/v2/admin/delete/:uid'
  public adminOnly = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.deleteUser(
        uid,
        Object.hasOwn(req.params ?? {}, 'rider')
      ),
      code: 200
    }
  }
}

export default V2AdminDeleteRider