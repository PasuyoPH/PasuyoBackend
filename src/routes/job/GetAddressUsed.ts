import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetAddressUsed extends Path {
  public path = '/jobs/:uid/addresses_used'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.jobs.getAddressUsed(uid),
      code: 200
    }
  }
}

export default GetAddressUsed