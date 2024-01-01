import { ItemTypes } from './MerchantItem'

interface Merchant {
  uid: string
  createdAt: number
  
  // customizable data
  name: string
  banner?: string
  logo?: string
  bio?: string
  tags?: string[]
  priceLevels?: number
  accent?: string
  types?: ItemTypes[] // for filter
  
  // state data
  open?: boolean
  hide?: boolean

  openAt?: number
  closedAt?: number
}

export default Merchant