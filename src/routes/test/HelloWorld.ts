import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class HelloWorld extends Path implements IRoute {
  public path   = '/tests/helloworld'
  public method = 'get'

  public requireUserToken = true

  public async onRequest() {
    return {
      value: 'Hello World',
      code: 200
    }
  }
}

export default HelloWorld