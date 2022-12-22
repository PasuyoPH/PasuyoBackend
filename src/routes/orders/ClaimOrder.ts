import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

// for riders only
class ClaimOrder extends Path implements IRoute {
  public path   = '/order/claim/:uid'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as any

    console.log(await this.server.utils.claimOrder('', uid))
  }
}

export default ClaimOrder