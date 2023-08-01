import { PickupPaymentTypes } from '../Services'
import { JobTypes } from '../database/Job'

interface NewJobData {
  type: JobTypes
  points: string[] // uid of addresses
  draft?: boolean
  cashPickup?: PickupPaymentTypes

  // job specific data

  // delivery
  item?: string
  weight?: string
}

export default NewJobData