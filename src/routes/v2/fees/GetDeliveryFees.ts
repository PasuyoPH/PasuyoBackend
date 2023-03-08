import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2GetDeliveryFees extends Path {
  public path = '/v2/fees/delivery/:distance'
  
  public async onRequest(req: HttpReq) {
    const { distance }: { distance: string } = req.params as any

    return {
      value: this.server.utils.calculateDeliveryFeeV2(distance),
      code: 200
    }
  }
}

export default V2GetDeliveryFees