import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetCustomerJobs extends Path implements IRoute {
  public path = '/jobs/customer'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.getUserJobs(this.user.uid),
      code: 200
    }
  }
}

export default GetCustomerJobs