import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class GetLikedItem extends Path {
  public method = 'get'
  public path = '/items/:uid/like'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.getLikedItem(this.user.uid, uid),
      code: 200  
    }
  }
}

export default GetLikedItem