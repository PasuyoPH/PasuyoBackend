import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AcceptJob extends Path {
  public path = '/jobs/:uid/accept'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.jobs.accept(uid, this.rider),
      code: 200
    }
  }
}

export default AcceptJob