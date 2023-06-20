import Path from '../../../base/Path'

class V3AdminGetRiders extends Path {
  public path = '/v3/admin/riders'
  public method = 'get'
  public admin = {
    check: true,
    role: []
  }

  public async onRequest() {
    return {
      value: await this.server.utils.getRiders(),
      code: 200
    }
  }
}

export default V3AdminGetRiders