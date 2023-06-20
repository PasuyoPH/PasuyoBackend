import Path from '../../../base/Path'

class V3GetAdminSelf extends Path {
  public method = 'get'
  public path = '/v3/admin/@me'
  public admin = {
    check: true,
    role: []
  }

  public async onRequest() {
    return {
      value: this.adminUser,
      code: 200,
    }
  }
}

export default V3GetAdminSelf