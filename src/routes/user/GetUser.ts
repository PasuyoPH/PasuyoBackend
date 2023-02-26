import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class GetUser extends Path implements IRoute {
  public path = '/user'
  public requireUserToken = true

  public async onRequest() {
    const user = {...this.user}
    delete user.pin

    return {
      value: user,
      code: 200
    }
  }
}

export default GetUser