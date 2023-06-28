import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class FinalizeJob extends Path {
  public method = 'post'
  public path = '/jobs/:uid'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')
    
    return {
      value: await this.server.utils.jobs.finalize(uid, this.user.uid),
      code: 200
    }
  }
}

export default FinalizeJob