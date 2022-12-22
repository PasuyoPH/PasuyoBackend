import { OrderStatus } from './Order'

// structure for delivery system
interface IDbDeliveryInfo {
  name: string
  contact: string

  address: string
  landmark?: string
}

interface IDbDelivery {
  from: IDbDeliveryInfo
  to: IDbDeliveryInfo

  item: string
  uid: string

  status: OrderStatus
}

export {
  IDbDeliveryInfo,
  IDbDelivery
}