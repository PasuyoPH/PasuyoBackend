import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class UpdateUserExpoToken extends Path {
  public method = 'post'
  public path = '/expo-token'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const token = req.body<string>('token')

    return {
      value: await this.server.utils.users.updateExpoToken(this.user.uid, token),
      code: 200
    }
  }
}

export default UpdateUserExpoToken