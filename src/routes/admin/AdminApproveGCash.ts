import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class AdminApproveGCash extends Path {
  public path = '/admin/transaction/:uid'
  public method = 'post'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.admins.approveGCash(uid)
    }
  }
}

export default AdminApproveGCash