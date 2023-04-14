import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetAddressesById extends Path {
  public path = '/v2/addresses/:ids' // id format: id,id,id,id
  public requireUserToken = true
  
  public async onRequest(req: HttpReq) {
    const ids = (req.params.ids as string)
      .split(',')

    return {
      value: await this.server.utils.rider.getAddressesById(ids),
      code: 200
    }
  }
}

export default V2GetAddressesById