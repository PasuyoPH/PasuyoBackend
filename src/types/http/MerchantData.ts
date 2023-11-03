import Address from '../database/Address'
import Merchant from '../database/Merchant'
import MerchantItem from '../database/MerchantItem'

interface MerchantData {
  data: Merchant
  items: MerchantItem[]
  likes: number
  address: Address
}

export default MerchantData