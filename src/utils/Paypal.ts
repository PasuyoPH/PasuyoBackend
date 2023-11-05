import HttpServer from '../base/HttpServer'
import axios from 'axios'
import PaypalRoutes from '../types/http/PaypalRoutes'
import PaypalAuthToken from '../types/http/PaypalAuthToken'
import HttpErrorCodes from '../types/ErrorCodes'
import HttpError from '../base/HttpError'
import Transaction, { TransactionStatus } from '../types/database/Transaction'
import Tables from '../types/Tables'
import PaypalOrder from '../types/http/PaypalOrder'
import { JobTypes } from '../types/database/Job'
import PaymentCreated from '../types/http/PaymentCreated'

class PaypalUtils {
  constructor(public server: HttpServer) {}

  public async getAccessToken() {
    const auth = Buffer.from(this.server.config.paypal.client_id + ':' + this.server.config.paypal.secret)
      .toString('base64'),
      res = await axios.post(
        PaypalRoutes.ACCESS_TOKEN,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      )

    // Emit even that we have new token
    await this.server.emit('paypal_access_token', res.data as PaypalAuthToken)
  }

  public async createPayment(user: string, uid: string, type: JobTypes): Promise<PaymentCreated> {
    if (!this.server.paypalAccessToken)
      throw new HttpError(
        HttpErrorCodes.PAYPAL_NO_ACCESS_TOKEN,
        'No access token for PayPal found. This is an error on our side, please try again in 5 seconds.'
      )

    const job = await this.server.utils.payment.getJobData(uid, type)

    // send checkout request
    const res = await axios.post(
      PaypalRoutes.CREATE_ORDER,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: uid, // This should be job data id itself
            amount: {
              currency_code: 'PHP',
              value: job.total.toFixed(2), // EXAMPLE
            }
          }
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: 'Pasuyo Services Inc.',
              return_url: 'http://localhost:8080/api/payment/paypal/done', // TODO: Place correct urls
              cancel_url: 'http://localhost:8080/api/payment/paypal/cancel',
              user_action: 'PAY_NOW'
            }
          }
        }
      },
      {
        headers: { Authorization: `Bearer ${this.server.paypalAccessToken}` }
      }
    ) as { data: PaypalOrder }

    // save our payments to database
    await this.server.db.table<Transaction>(Tables.Transactions)
      .insert(
        {
          uid: res.data.id,
          status: TransactionStatus.WAITING_USER_PAYMENT,
          amount: job.total,
          user,
          job: uid,
          createdAt: Date.now()
        }
      )

    const redirectTo = res.data.links.find(
      (link) => link.rel === 'approve' || link.rel === 'payer-action'
    )

    if (!redirectTo)
      throw new HttpError(
        HttpErrorCodes.PAYPAL_FAILED_TO_GET_APPROVED,
        'Failed to get approval for payment. Please try again.'
      )

    return {
      id: res.data.id,
      redirectTo: redirectTo.href
    }
  }

  public async captureOrder(uid: string) {
    if (!this.server.paypalAccessToken)
      throw new HttpError(
        HttpErrorCodes.PAYPAL_NO_ACCESS_TOKEN,
        'No access token for PayPal found. This is an error on our side, please try again in 5 seconds.'
      )

    // fetch the transaction data first
    const transaction = await this.server.db.table<Transaction>(Tables.Transactions)
      .select('*')
      .where('uid', uid)
      .first()

    if (!transaction)
      throw new HttpError(
        HttpErrorCodes.PAYPAL_NO_TRANSACTION_EXISTS,
        'This doesn\'t seem to be a valid paypal transaction.'
      )

    if (transaction.status === TransactionStatus.USER_PAID)
      throw new HttpError(
        HttpErrorCodes.PAYPAL_ALREADY_PAID,
        'User has already paid for this transaction via PayPal.'
      )

    const res = await axios.post(
      PaypalRoutes.CAPTURE_ORDER(uid),
      {},
      {
        headers: {
          Authorization: `Bearer ${this.server.paypalAccessToken}`
        }
      }
    )

    if (res.data.status !== 'COMPLETED')
      throw new HttpError(
        HttpErrorCodes.PAYPAL_PAYMENT_FAILED,
        'Payment with PayPal has failed. Please try again later.'
      )

    // Payment complete, update status for transaction
    transaction.status = TransactionStatus.USER_PAID
    await this.server.db.table<Transaction>(Tables.Transactions)
      .update(transaction)
      .where('uid', transaction.uid)

    // todo: if this is a delivery, remove draft

    return transaction
  }
}

export default PaypalUtils