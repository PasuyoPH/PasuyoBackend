import { IDbDelivery } from './Delivery'
import { IDbOrder } from './Order'

// Structure for users in the db
enum UserRole {
  CUSTOMER,
  DRIVER,
  ADMIN
}

interface IDbUser {
  email: string
  pin: number

  phone?: number
  uid: string

  role: UserRole
  orders: IDbOrder[]

  deliveries: IDbDelivery[]
  jobs: any[] // for rider
}

export {
  IDbUser,
  UserRole
}