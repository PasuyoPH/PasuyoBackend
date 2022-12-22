import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetCompanies extends Path implements IRoute {
  public path   = '/companies'
  public method = 'get'

  public async onRequest() {
    return {
      value: await this.server.utils.getCompanies(),
      code: 200
    }
  }
}

export default GetCompanies