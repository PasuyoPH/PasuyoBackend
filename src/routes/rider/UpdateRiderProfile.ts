import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class UpdateRiderProfile extends Path {
  public method = 'patch'
  public path = '/riders/@me/profile'
  public permissions: PathPermissions = {
    check: 'rider'
  }

  public async onRequest(req: ClientRequest) {
    const file = await this.server.utils.parseFile(req)

    return {
      value: await this.server.utils.users.updateProfile(this.rider.uid, file, true),
      code: 200
    }
  }
}

export default UpdateRiderProfile