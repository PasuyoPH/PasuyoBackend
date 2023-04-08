import Path from '../base/Path'
import { IRoute } from '../types/Http'

class DefaultRoute extends Path implements IRoute {
  public async onRequest() {
    return {
      value: {
        v: '1',
        t: Date.now()
      },
      code: 200
    }
  }
}

export default DefaultRoute