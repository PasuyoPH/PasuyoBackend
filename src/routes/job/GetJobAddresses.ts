import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetJobAddresses extends Path {
  public path = '/jobs/:uid/addresses'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')
    return {
      value: await this.server.utils.jobs.getJobAddresses(uid),
      code: 200
    }
  }
}

export default GetJobAddresses