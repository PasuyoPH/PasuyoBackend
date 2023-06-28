import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import NewAddressData from '../../types/http/NewAddressData'
import PathPermissions from '../../types/path/PathPermissions'

class NewUserAddress extends Path {
  public method = 'post'
  public path = '/addresses'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const data = req.body<NewAddressData>('address')
    
    return {
      value: await this.server.utils.addresses.create(data, this.user.uid),
      code: 200
    }
  }
}

export default NewUserAddress