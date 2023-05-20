import Path from '../../base/Path'

class V2AdminGetRiders extends Path {
  public path = '/v2/admin/riders'
  public adminOnly = true

  public async onRequest() {
    return {
      value: await this.server.utils.getRiders(),
      code: 200
    }
  }
}

export default V2AdminGetRiders