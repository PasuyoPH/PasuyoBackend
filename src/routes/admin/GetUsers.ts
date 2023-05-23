import Path from '../../base/Path'

class V2AdminGetUsers extends Path {
  public path = '/v2/admin/users'
  public adminOnly = true

  public async onRequest() {
    return {
      value: await this.server.utils.getUsers(),
      code: 200
    }
  }
}

export default V2AdminGetUsers