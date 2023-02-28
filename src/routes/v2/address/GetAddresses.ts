import Path from '../../../base/Path'

class V2GetAddresses extends Path {
  public path = '/v2/addresses'
  public requireUserToken = true
  
  public async onRequest() {
    return {
      value: await this.server.utils.user.getAddresses(this.user.uid),
      code: 200
    }
  }
}

export default V2GetAddresses