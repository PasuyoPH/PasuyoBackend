import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

// This just removes their request
class AdminApproveLoad extends Path {
  public method = 'post'
  public path = '/admin/rider/load'

  public async onRequest(req: ClientRequest) {
    const uid = req.body<string>('uid')

    return {
      value: await this.server.utils.admins.approveLoad(uid),
      code: 200
    }
  }
}

export default AdminApproveLoad