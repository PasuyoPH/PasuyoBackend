import ClientRequest from '../../../base/ClientRequest'
import Path from '../../../base/Path'

class CompletePayment extends Path {
  public path = '/payment/paypal/:uid'
  public method = 'post'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid')

    return {
      value: await this.server.utils.paypal.captureOrder(uid),
      code: 200
    }
  }
}

export default CompletePayment