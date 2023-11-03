import { JobTypes } from './Job'

enum OrderStatus {
  ORDER_PROCESSED, // order is being processed by merchant
  ORDER_CREATING, // order is being created
  READY_TO_PICKUP, // ready to pickup from merchant
  HOME_RUN, // going home
  GOAL // arrived, ( done )
}

// new interface for ordering items
interface Order {
  uid: string // id of the order
  items: string // array of "id-quantity"
  merchant: string // id of the merchant
  
  total: number // total price
  createdAt: number // when the order was created

  user: string // user who made the order
  deliverTo: string // uid of the address to drop off

  startedAt?: number
  endedAt?: number

  distance?: number
  eta?: number
  
  proof?: string
  rider?: string // proof of who the rider is

  status: OrderStatus
  draft?: boolean

  type?: JobTypes
}

export default Order
export { OrderStatus }