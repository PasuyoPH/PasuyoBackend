import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

// route to test auth
class AuthTest extends Path implements IRoute {
  public path = '/auth/test'
  public requireUserToken = true

  public async onRequest() {
    return {
      value: `Hello ${this.user.fullName}`,
      code: 200
    }
  }
}

export default AuthTest