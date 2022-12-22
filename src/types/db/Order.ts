import IDbMeal from './Meal'

interface IMealAsOrder extends IDbMeal{
  quantity: number
}

enum OrderStatus {
  PROCESSED,
  AVAILABLE_FOR_PICKUP,
  PICKED_UP,
  DELIVERED
}

// Structure for orders in the db 
interface IDbOrder {
  uid: string
  meals: IMealAsOrder[]
   
  address: string
  status: OrderStatus
}

export {
  IMealAsOrder,
  OrderStatus,
  IDbOrder
}