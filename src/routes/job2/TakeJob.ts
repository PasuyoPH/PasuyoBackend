import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { JobTypes } from '../../types/database/Job'
import PathPermissions from '../../types/path/PathPermissions'

class TakeJob extends Path {
  public method = 'post'
  public path = '/jobs2/:uid'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const jobType = req.body<JobTypes>('type'),
      uid = req.params('uid')

    return {
      value: await this.server.utils.jobs2.take(this.rider, uid, jobType),
      code: 200
    }
  }
}

export default TakeJob