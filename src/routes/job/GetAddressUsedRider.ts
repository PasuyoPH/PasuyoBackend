import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetAddressUsedRider extends Path {
  public path = '/jobs/:uid/addresses_used/rider'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.jobs.getAddressUsed(uid),
      code: 200
    }
  }
}

export default GetAddressUsedRider