import Path from '../base/Path'

class GetPromos extends Path {
  public path = '/promos'

  public async onRequest() {
    return {
      value: await this.server.utils.getPromos(),
      code: 200
    }
  }
}

export default GetPromos