import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import Address from '../../types/database/Address'
import PathPermissions from '../../types/path/PathPermissions'

class EditUserAddress extends Path {
  public method = 'patch'
  public path = '/addresses/:uid'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      address = req.body<Address>('address')

    return {
      value: await this.server.utils.addresses.edit(address, uid, this.user.uid),
      code: 200
    }
  }
}

export default EditUserAddress