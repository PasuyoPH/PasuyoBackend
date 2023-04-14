import Path from '../../../base/Path'

class V2GetDrafts extends Path {
  public method = 'get'
  public path = '/v2/drafts'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.user.getDrafts(this.user.uid),
      code: 200
    }
  }
}

export default V2GetDrafts