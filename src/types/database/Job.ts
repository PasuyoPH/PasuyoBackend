import { PickupPaymentTypes } from '../Services'
import Tables from '../Tables'

enum JobTypes {
  DELIVERY,
  ORDER
}

enum JobStatus {
  PROCESSED,
  ACCEPTED,

  DELIVERY_PICKED_UP,
  
  DONE,
  CANCELLED = -1
}

interface Job {
  uid: string
  user: string // user who created the job
  rider?: string // rider who took the job
  type: JobTypes
  status: JobStatus
  createdAt: number

  // Time of job
  startedAt?: number
  finishedAt?: number

  // Other properties
  draft?: boolean

  distance: number
  fee: number
  eta: number
  
  riderFee?: number
  
  // Service specific data
  
  // Delivery
  item?: string
  weight?: string

  proof?: string // evidence of completion
  cashPickup?: PickupPaymentTypes
}

export default Job
export { JobStatus, JobTypes }