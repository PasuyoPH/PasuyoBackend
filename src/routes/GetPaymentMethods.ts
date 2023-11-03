import Path from '../base/Path'

class GetPaymentMethods extends Path {
  public path = '/methods'
  public method = 'get'

  public async onRequest() {
    return {
      value: this.server.config.payment_methods,
      code: 200
    }
  }
}

export default GetPaymentMethods