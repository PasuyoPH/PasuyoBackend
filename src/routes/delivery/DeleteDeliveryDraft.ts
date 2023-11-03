import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class DeleteDeliveryDraft extends Path {
  public method = 'delete'
  public path = '/delivery/:uid'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.deliveries.deleteDraft(uid, this.user.uid),
      code: 200
    }
  }
}

export default DeleteDeliveryDraft