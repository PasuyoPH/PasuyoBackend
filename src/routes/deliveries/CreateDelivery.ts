import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

class CreateDelivery extends Path implements IRoute {
  public path   = '/deliveries'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const {
      from,
      to,
      item
    } = req.body as any

    if (typeof item !== 'string' || item.length < 3)
      return {
        error: true,
        message: 'Please be more descriptive with the item.',
        code: 400
      }

    return {
      value: await this.server.utils.createDelivery(this.user.uid, from, to, item),
      code: 200
    }
  }
}

export default CreateDelivery