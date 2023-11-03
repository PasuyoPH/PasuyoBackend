import { JobTypes } from './database/Job'
import Order from './database/Order'

interface PaymentJobDataOrder {
  type: JobTypes.ORDER
  data: Order
}

interface PaymentJobDataDelivery {
  type: JobTypes.DELIVERY
  data: null
}

type PaymentJobData = PaymentJobDataDelivery | PaymentJobDataOrder

export default PaymentJobData
export { PaymentJobDataDelivery, PaymentJobDataOrder }