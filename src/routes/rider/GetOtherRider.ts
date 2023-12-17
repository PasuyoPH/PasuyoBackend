import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetOtherRider extends Path {
  public path = '/rider/:uid'
  public permissions: PathPermissions = {
    check: 'rider'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: this.server.utils.riders.getOtherRider(uid),
      code: 200
    }
  }
}

export default GetOtherRider