import { JobTypes } from '../database/Job'
import PaymentKind from './PaymentKind'
import PaymentTypes from './PaymentType'

interface NewPaymentData {
  user: string
  uid?: string
  jobType: JobTypes
  paymentType: PaymentTypes // payment method
  
  // optional fields
  receipt?: string
  kind?: PaymentKind // defaults to 0
  amount?: number // for load purposes
}

export default NewPaymentData