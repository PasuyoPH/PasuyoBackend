import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class AddRiderCredits extends Path {
  public method = 'post'
  public path = '/admin/rider/credits'
  public permissions: PathPermissions = {
    check: 'admin'
  }
  
  public async onRequest(req: ClientRequest) {
    const rider = req.body<string>('rider'),
      credits = req.body<number>('credits')

    return {
      value: await this.server.utils.admins.setRiderCredits(rider, credits),
      code: 200
    }
  }
}

export default AddRiderCredits