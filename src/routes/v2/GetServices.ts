import Path from '../../base/Path'
import { Services } from '../../types/v2/PasuyoService'

class GetServices extends Path {
  public path = '/v2/services'
  public requireUserToken = false // false for debug mode

  public async onRequest() {
    return {
      value: Services,
      code: 200
    }
  }
}

export default GetServices