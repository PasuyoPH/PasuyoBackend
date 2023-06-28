import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class RiderOptIn extends Path {
  public path = '/riders/@me/opt-in'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const status = req.body<boolean>('status')

    return {
      value: await this.server.utils.riders.optIn(this.rider.uid, status),
      code: 200
    }
  }
}

export default RiderOptIn