import Path from '../../base/Path'

// get list of load requests
class V2GetLoadRequests extends Path {
  public path = '/v2/admin/loads'
  public adminOnly = true

  public async onRequest() {
    return {
      value: await this.server.utils.getLoadRequests(),
      code: 200
    }
  }
}

export default V2GetLoadRequests