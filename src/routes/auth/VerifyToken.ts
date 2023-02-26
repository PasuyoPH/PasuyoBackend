import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

import { ITokenType } from '../../types/Token'

class VerifyToken extends Path implements IRoute {
  public path = '/auth/verify'
  public requireUserToken = true

  public async onRequest() {

    return {
      value: Object.hasOwn(this.user, 'verified') ?
        ITokenType.RIDER :
        ITokenType.CUSTOMER,
      code: 200
    }
  }
}

export default VerifyToken