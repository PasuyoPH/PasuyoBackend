import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class AdminSetRiderMode extends Path {
  public path = '/admin/mode/:uid'
  public method = 'post'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      mode = req.body<number>('mode')

    return {
      value: await this.server.utils.admins.setRiderMode(uid, mode)
    }
  }
}

export default AdminSetRiderMode