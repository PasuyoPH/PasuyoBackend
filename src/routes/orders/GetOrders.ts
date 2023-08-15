import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

// Fetch order data of a specific job
class GetOrders extends Path {
  public method = 'get'
  public path = '/orders/:uid'
  
  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.orders.getOrders(uid),
      code: 200
    }
  }
}

export default GetOrders