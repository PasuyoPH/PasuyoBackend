import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Delivery from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'
import LoadRequest from '../types/database/LoadRequest'
import Order from '../types/database/Order'
import Transaction, { TransactionStatus } from '../types/database/Transaction'
import PaymentCreated from '../types/http/PaymentCreated'

class GCashUtils {
  constructor(private server: HttpServer) {}

  public async createManualPaymentLoad(user: string, uid: string, amount: number, receipt: string) {
    if (!receipt)
      throw new HttpError(
        HttpErrorCodes.PAYMENT_INVALID_RECEIPT_GCASH,
        'Invalid receipt was provided for gcash (manual).'
      )

    if (typeof amount !== 'number' || amount <= 0)
      throw new HttpError(
        HttpErrorCodes.LOAD_TOO_LOW,
        'Load amount is invalid. Please choose a proper amount.'
      )

    // We create a transaction object and also insert load request data to a table
    // We can use the same id for creating the load request as well. It will be deleted after use.
    const generatedTransactionId = await this.server.utils.crypto.genUID()  

    // save our payment ( but as pending ) to database
    await this.server.db.table<Transaction>(Tables.Transactions)
      .insert(
        {
          uid: generatedTransactionId,
          status: TransactionStatus.GCASH_MANUAL_WAITING_FOR_CONFIRMATION,
          amount,
          user,
          createdAt: Date.now(),
          receipt,
          job: uid ?? ''
        }
      )

    // insert to load request
    await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .insert(
        {
          uid: generatedTransactionId,
          amount,
          user,
          receipt
        }
      )

    return {
      id: generatedTransactionId,
      redirectTo: null
    }
  }

  // We basically just insert a transaction object to the database and
  // create the job immediately. No need for other verifications as this is pay with cash on delivery
  public async createManualPayment(user: string, uid: string, type: JobTypes, receipt: string): Promise<PaymentCreated> {
    if (!receipt)
      throw new HttpError(
        HttpErrorCodes.PAYMENT_INVALID_RECEIPT_GCASH,
        'Invalid receipt was provided for gcash (manual).'
      )

    const job = await this.server.utils.payment.getJobData(uid, type),
      generatedId = await this.server.utils.crypto.genUID()

    // unmark as draft, but don't send to riders. payment is not yet confirmed yet.
    switch (job.type) {
      case JobTypes.DELIVERY: {
        await this.server.db.table<Delivery>(Tables.Deliveries)
          .update({ draft: false })
          .where({ uid })
      } break

      case JobTypes.ORDER: {
        await this.server.db.table<Order>(Tables.Orders)
          .update({ draft: false })
          .where({ uid })
      } break
    }

    // save our payment ( but as pending ) to database
    await this.server.db.table<Transaction>(Tables.Transactions)
      .insert(
        {
          uid: generatedId,
          status: TransactionStatus.GCASH_MANUAL_WAITING_FOR_CONFIRMATION,
          amount: job.total,
          user,
          createdAt: Date.now(),
          receipt,
          job: uid
        }
      )
    
    return {
      id: generatedId,
      redirectTo: null
    }
  }
}

export default GCashUtils