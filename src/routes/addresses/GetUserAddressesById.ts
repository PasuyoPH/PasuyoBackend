import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetUserAddressesById extends Path {
  public method = 'get'
  public path = '/addresses/:ids' // format: id,id,id
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const ids = req.params('ids')
      .split(',')

    return {
      value: await this.server.utils.addresses.get(ids),
      code: 200
    }
  }
}

export default GetUserAddressesById