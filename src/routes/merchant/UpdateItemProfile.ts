import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class UpdateItemProfile extends Path {
  public method = 'patch'
  public path = '/items/profile'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const file = await this.server.utils.parseFile(req)

    return {
      value: await this.server.utils.uploadProfile(file),
      code: 200
    }
  }
}

export default UpdateItemProfile