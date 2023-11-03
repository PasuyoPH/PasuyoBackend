import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class JobPickedUp extends Path {
  public path = '/jobs2/:uid/pickedup'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.jobs2.pickedUp(uid),
      code: 200
    }
  }
}

export default JobPickedUp