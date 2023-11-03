import { Geo } from './Address'
import { ItemTypes } from './MerchantItem'

interface Merchant extends Geo { // this would include lat & long due to it having specific branch locations
  uid: string
  createdAt: number
  banner?: string
  logo?: string
  name: string
  bio?: string
  sales?: number
  tags?: string[]
  priceLevels?: number
  accent?: string
  types: ItemTypes[] // for filters
}

export default Merchant