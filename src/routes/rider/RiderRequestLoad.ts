import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class RiderRequestLoad extends Path {
  public method = 'post'
  public path = '/riders/@me/load'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const file = await this.server.utils.parseFile(req)

    return {
      value: await this.server.utils.riders.requestLoad(this.rider.uid, file),
      code: 200
    }
  }
}

export default RiderRequestLoad