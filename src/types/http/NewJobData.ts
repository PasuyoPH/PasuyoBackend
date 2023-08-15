import { PickupPaymentTypes } from '../Services'
import { JobTypes } from '../database/Job'
import OrderData from './OrderData'

interface NewJobData {
  type: JobTypes
  points: string[] // uid of addresses
  draft?: boolean
  cashPickup?: PickupPaymentTypes

  // job specific data

  // delivery
  item?: string
  weight?: string

  // pa order
  orders?: OrderData[]
}

export default NewJobData