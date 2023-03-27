import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import { V2UserRoles } from '../../../types/v2/db/User'

class V2UpdateProfile extends Path {
  public path = '/v2/user/profile'
  public method = 'patch'

  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    const isRider = this.user.role === V2UserRoles.RIDER,
      file = await this.server.utils.parseFile(req)

    return {
      value: await this.server.utils.user.updateProfile(
        this.user.uid,
        isRider,
        file
      ),
      code: 200
    }
  }
}

export default V2UpdateProfile