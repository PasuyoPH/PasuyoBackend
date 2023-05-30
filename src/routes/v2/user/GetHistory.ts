import Path from '../../../base/Path'

class V2GetHistory extends Path {
  public path = '/v2/user/history'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.user.getHistory(this.user.uid),
      code: 200
    }
  }
}

export default V2GetHistory