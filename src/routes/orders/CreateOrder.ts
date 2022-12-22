import Path from '../../base/Path'
import { IMealAsOrder } from '../../types/db/Order'

import { HttpReq, IRoute } from '../../types/Http'

class CreateOrder extends Path implements IRoute {
  public path   = '/orders'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { meals, address } = req.body as any as (
        { meals: IMealAsOrder[], address: string }
      )

    if (
      !Array.isArray(meals) ||
      meals.length < 1 ||
      meals.length > this.server.config.maxMealsPerOrder
    )
      return {
        error: true,
        message: 'Invalid meals provided.',
        code: 400 
      }

    return {
      value: await this.server.utils.createOrder(
        this.user.uid,
        meals,
        address
      ),
      code: 200
    }
  }
}

export default CreateOrder