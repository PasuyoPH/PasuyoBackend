import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import NewJobData from '../../types/http/NewJobData'
import PathPermissions from '../../types/path/PathPermissions'

/**
 * This class creates a job preview only.
 */
class CreateJob extends Path {
  public method = 'post'
  public path = '/jobs'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const data = req.body<NewJobData>('job')
    console.log(data)
    return {
      value: await this.server.utils.jobs.create(data, this.user.uid),
      code: 200
    }
  }
}

export default CreateJob