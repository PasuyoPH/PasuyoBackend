import { JobTypes } from './Job'

enum DeliveryStatus {
  DELIVERY_PROCESSED,
  DELIVERY_PICKED_UP,
  HOME_RUN,
  GOAL
}

// new interface for ordering items
interface Delivery {
  uid: string // id of the delivery
  weight: number // weight of the delivery
  name: string // name of the item to deliver
  
  createdAt: number // when the order was created
  user: string // user who made the order
  deliverTo: string // uid of the address to drop off

  startedAt?: number
  endedAt?: number

  distance?: number
  eta?: number
  
  proof?: string
  rider?: string // proof of who the rider is

  status: DeliveryStatus
  draft?: boolean

  // fees
  fee?: number
  riderFee?: number

  type?: JobTypes
  image: string
}

export default Delivery
export { DeliveryStatus }