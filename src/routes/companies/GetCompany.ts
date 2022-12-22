import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

class GetCompany extends Path implements IRoute {
  public path   = '/company/:uid'
  public method = 'get'

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as any
    return {
      value: await this.server.utils.getCompany(uid),
      code: 200
    }
  }
}

export default GetCompany