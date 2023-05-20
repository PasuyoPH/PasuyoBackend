import Path from '../../base/Path'

class V2GetVersion extends Path {
  public path = '/v2/version'

  public async onRequest() {
    return {
      value: this.server.config.apiVersion, // return api version
      code: 200
    }
  }
}

export default V2GetVersion