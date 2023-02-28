import { V2UserRoles } from './db/User'

// token data type
interface V2TokenData {
  uid: string
  pin: string

  role: V2UserRoles
}

export {
  V2TokenData
}