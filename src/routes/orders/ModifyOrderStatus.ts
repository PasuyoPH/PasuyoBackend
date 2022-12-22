import Path from '../../base/Path'
import { OrderStatus } from '../../types/db/Order'

import { HttpReq, IRoute } from '../../types/Http'

// todo: Rider Only or Admin
class ModifyOrderStatus extends Path implements IRoute {
  public path   = '/order/:uid'
  public method = 'patch'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as any,
      { status } = req.body as any

    if (
      !this.user.orders.find((order) => order.uid === uid)
    )
      return {
        error: true,
        message: 'This order doesn\'t exist or it doesn\'t belong to you.',
        code: 400
      }

    if (
      isNaN(status)
    )
      return {
        error: true,
        message: 'Invalid status was provided.',
        code: 400
      }

    // modify the order status
    return {
      value: await this.server.utils.modifyOrderStatus(
        this.user.uid,
        uid,
        status
      ),
      code: 200
    }
  }
}

export default ModifyOrderStatus