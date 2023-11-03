import ClientRequest from '../../../base/ClientRequest'
import Path from '../../../base/Path'
import { JobTypes } from '../../../types/database/Job'
import PathPermissions from '../../../types/path/PathPermissions'

class CreateCashPayment extends Path {
  public method = 'post'
  public path = '/payment/cash'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.body<string>('uid'), // id of data
      type = req.body<JobTypes>('type')

    return {
      value: await this.server.utils.cash.createPayment(this.user.uid, uid, type),
      code: 200
    }
  }
}

export default CreateCashPayment