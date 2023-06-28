import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetJobRider extends Path {
  public path = '/jobs/:uid/rider'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.jobs.getRider(uid, this.user.uid),
      code: 200
    }
  }
}

export default GetJobRider