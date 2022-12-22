import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

// todo: Rider Only or Admin
class ModifyDeliveryStatus extends Path implements IRoute {
  public path   = '/delivery/:uid'
  public method = 'patch'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as any,
      { status } = req.body as any

    if (isNaN(status))
      return {
        error: true,
        message: 'Invalid status was provided.',
        code: 400
      }

    // modify the order status
    return {
      value: await this.server.utils.modifyDeliveryStatus(
        this.user.uid,
        uid,
        status
      ),
      code: 200
    }
  }
}

export default ModifyDeliveryStatus