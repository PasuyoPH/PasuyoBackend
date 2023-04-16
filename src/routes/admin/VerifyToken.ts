import Path from '../../base/Path'

class V2AdminVerifyToken extends Path {
  public path = '/v2/admin/verify'
  public adminOnly = true

  public async onRequest() {
    return {
      value: true,
      code: 200
    }
  }
}

export default V2AdminVerifyToken