import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { JobStatus } from '../../types/database/Job'
import PathPermissions from '../../types/path/PathPermissions'

class UpdateJobStatus extends Path {
  public method = 'patch'
  public path = '/jobs/:uid/status'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      status = req.body<JobStatus>('status')

    return {
      value: await this.server.utils.jobs.updateJobStatus(uid, status, this.rider),
      code: 200
    }
  }
}

export default UpdateJobStatus