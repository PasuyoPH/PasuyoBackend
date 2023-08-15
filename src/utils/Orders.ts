import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import Order from '../types/database/Order'
import OrderData from '../types/http/OrderData'

class OrderUtils {
  constructor(public server: HttpServer) {}

  public async addItem(job: string, data: OrderData[]) {
    return await this.server.db.table<Order>(Tables.Orders)
      .insert(
        data.map(
          (order) => (
            { ...order, job }
          )
        )
      )
      .returning('*')
  }

  // get orders of a job
  public async getOrders(uid: string) {
    return await this.server.db.table<Order>(Tables.Orders)
      .select('*')
      .where('job', uid)
  }
}

export default OrderUtils