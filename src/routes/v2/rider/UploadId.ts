import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2RiderUploadID extends Path {
  public method = 'post'
  public path = '/v2/rider/id'
  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    // parse the image file to receive
    const result = await this.server.utils.parseFile(req)
    await this.server.utils.rider.uploadRiderID(result, this.user.uid)

    return {
      value: null,
      code: 200
    }
  }
}

export default V2RiderUploadID