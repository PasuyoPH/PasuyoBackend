import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

// driver only
class GetOrders extends Path implements IRoute {
  public path   = '/orders' 
  public method = 'get'

  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.getOrders(),
      code: 200
    }
  }
}

export default GetOrders