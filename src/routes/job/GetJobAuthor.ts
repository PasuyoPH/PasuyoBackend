import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetJobAuthor extends Path {
  public path = '/jobs/:uid/author'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')
    return {
      value: await this.server.utils.jobs.getJobAuthor(uid),
      code: 200
    }
  }
}

export default GetJobAuthor