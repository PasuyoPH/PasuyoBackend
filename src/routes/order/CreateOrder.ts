import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import OrderData from '../../types/http/OrderData'
import PathPermissions from '../../types/path/PathPermissions'

class CreateOrder extends Path {
  public method = 'post'
  public path = '/orders'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const data = req.body<OrderData[]>('data'),
      address = req.body<string>('address')

    return {
      value: await this.server.utils.orders.create(this.user.uid, address, data),
      code: 200
    }
  }
}

export default CreateOrder