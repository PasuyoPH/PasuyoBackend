import Path from '../../base/Path'

class V2AdminGetUnverifiedRiders extends Path {
  public path = '/v2/admin/unverified'
  public adminOnly = true

  public async onRequest() {
    return {
      value: await this.server.utils.getUnverifiedRiders(),
      code: 200
    }
  }
}

export default V2AdminGetUnverifiedRiders