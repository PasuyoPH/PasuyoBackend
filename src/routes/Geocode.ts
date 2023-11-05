import ClientRequest from '../base/ClientRequest'
import Path from '../base/Path'

class Geocode extends Path {
  public path = '/geo'
  public method = 'post'
  /*public permissions: PathPermissions = {
    check: 'user'
  }*/

  public async onRequest(req: ClientRequest) {
    const lat = req.body<number>('lat'),
      long = req.body<number>('long')

    return {
      value: await this.server.utils.reverseGeoCode(lat, long),
      code: 200
    }
  }
}

export default Geocode