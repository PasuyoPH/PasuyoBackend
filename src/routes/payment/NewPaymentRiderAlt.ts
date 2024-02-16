import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { JobTypes } from '../../types/database/Job'
import PaymentKind from '../../types/http/PaymentKind'
import PaymentTypes from '../../types/http/PaymentType'

class NewPaymentRiderAlt extends Path {
  public method = 'post'
  public path = '/payment/rider/:uid'

  public async onRequest(req: ClientRequest) {
    const uid = req.body<string>('uid'), // id of data
      type = req.body<JobTypes>('type'),
      paymentType = req.body<PaymentTypes>('payment_method'),
      receipt = req.body<string>('payment_receipt'),
      rider = req.params('uid'),
      
      // optional fields
      amount = req.body<number>('payment_amount'), // only recognized if purchasing load
      kind = req.body<PaymentKind>('payment_kind') ?? PaymentKind.PRODUCT

    return {
      value: await this.server.utils.payment.createPayment(
        {
          user: rider,
          uid,
          jobType: type,
          paymentType,
          receipt,

          // optional fields
          amount,
          kind
        }
      ),
      code: 200
    }
  }
}

export default NewPaymentRiderAlt