import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import V2HttpAddressData from '../../../types/v2/http/Address'

class V2ModifyAddress extends Path {
  public path = '/v2/addresses/:uid'
  public method = 'patch'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string }

    return {
      value: await this.server.utils.user.modifyAddress(
        this.user.uid,
        uid,
        req.body as any as V2HttpAddressData
      ),
      code: 200
    }
  }
}

export default V2ModifyAddress