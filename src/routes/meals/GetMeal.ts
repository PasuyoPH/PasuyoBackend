import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

class GetMeal extends Path implements IRoute {
  public path   = '/meal/:uid'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as any
    return {
      value: await this.server.utils.getMeal(uid),
      code: 200
    }
  }
}

export default GetMeal