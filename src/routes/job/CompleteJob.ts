import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class CompleteJob extends Path {
  public method = 'post'
  public path = '/jobs/:uid/complete'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const file = await this.server.utils.parseFile(req),
      uid = req.params('uid')
    
    await this.server.utils.jobs.complete(uid, this.rider, file)

    return {
      value: null,
      code: 200
    }
  }
}

export default CompleteJob