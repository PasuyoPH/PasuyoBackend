import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Delivery from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'
import Order from '../types/database/Order'
import NewPaymentData from '../types/http/NewPaymentData'
import PaymentCreated from '../types/http/PaymentCreated'
import PaymentKind from '../types/http/PaymentKind'
import PaymentTypes from '../types/http/PaymentType'

class PaymentUtils {
  constructor(public server: HttpServer) {}

  public async createPayment(
    {
      user, uid, jobType,
      paymentType, receipt,
      kind, amount
    }: NewPaymentData
  ) {
    if (this.server.config.payment_methods[paymentType]?.disabled)
      throw new HttpError(
        HttpErrorCodes.PAYMENT_DISABLED,
        'This payment method is ccurrently disabled. Please choose another option.'
      )

    let result: PaymentCreated

    switch (kind) {
      case PaymentKind.PRODUCT: {
        switch (paymentType) {
          case PaymentTypes.COD: {
            result = await this.server.utils.cash.createPayment(user, uid, jobType)
          } break
    
          case PaymentTypes.PAYPAL_PP: {
            result = await this.server.utils.paypal.createPayment(user, uid, jobType)
          } break
    
          case PaymentTypes.GCASH_MANUAL: {
            result = await this.server.utils.gcash.createManualPayment(user, uid, jobType, receipt)
          } break
    
          default: {
            throw new HttpError(
              HttpErrorCodes.PAYMENT_INVALID_PAYMENT_METHOD,
              'Invalid payment method was provided. Please try again.'
            )
          }
        }
      } break

      case PaymentKind.LOAD: {
        switch (paymentType) {    
          case PaymentTypes.GCASH_MANUAL: {
            // support gcash only for now
            result = await this.server.utils.gcash.createManualPaymentLoad(user, uid, amount, receipt)
          } break
    
          default: {
            throw new HttpError(
              HttpErrorCodes.PAYMENT_INVALID_PAYMENT_METHOD,
              'Invalid payment method was provided. Please try again.'
            )
          }
        }
      } break
    }

    return result
  }

  public async getJobData(uid: string, type: JobTypes) {
    let tableName: string = null
    switch (type) {
      case JobTypes.ORDER: {
        tableName = Tables.Orders
      } break

      case JobTypes.DELIVERY: {
        tableName = Tables.Deliveries
      } break
    }

    if (!tableName)
      throw new HttpError(
        HttpErrorCodes.PAYMENT_INVALID_JOB_TYPE,
        'Invalid type provided to confirm payment.'
      )

    // fetch the data
    const data = (
      await this.server.db.table(tableName)
        .select('*')
        .where('uid', uid)
        .first()
    )// as { total: number }

    if (!data)
      throw new HttpError(
        HttpErrorCodes.PAYMENT_NO_JOB_DATA_FOUND,
        'No data found to proceed with payment.'
      )

    let total: number = 0.00
    switch (type) {
      case JobTypes.ORDER: {
        total = (data as Order).total
      } break

      case JobTypes.DELIVERY: {
        total = (data as Delivery).fee
      } break
    }

    return {
      type,
      total
    }
  }
}

export default PaymentUtils