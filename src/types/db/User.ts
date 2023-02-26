import { IRiderStates } from './Rider'

interface User {
  uid?: string
  email?: string
  
  phone?: string
  fullName?: string

  pin?: string
  role?: 'CUSTOMER' | 'ADMIN' | 'RIDER'
}

interface Rider extends User {
  state?: IRiderStates
  verified?: boolean
}

export {
  Rider,
  User
}