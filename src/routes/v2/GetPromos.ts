import Path from '../../base/Path';

class V2GetPromos extends Path {
  public path = '/v2/promos'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: await this.server.utils.getPromos(),
      code: 200
    }
  }
}

export default V2GetPromos