import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2DeleteAddress extends Path {
  public path   = '/v2/addresses/:uid'
  public method = 'delete'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid }: { uid: string } = req.params as any

    return {
      value: await this.server.utils.user.deleteAddress(this.user.uid, uid),
      code: 200
    }
  }
}

export default V2DeleteAddress