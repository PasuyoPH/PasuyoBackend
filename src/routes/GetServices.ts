import Path from '../base/Path'
import { Services } from '../types/Services'

class GetServices extends Path {
  public path = '/services'

  public async onRequest() {
    return {
      value: Services,
      code: 200
    }
  }
}

export default GetServices