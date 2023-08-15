enum ItemTypes {
  PIZZA,
  CHICKEN,
  BR_BR_COLD_ASS_CREAM_NIGGA,
  BURGER,
  OTHER, // for unspecified
}

interface MerchantItem {
  uid: string
  merchant: string
  name: string
  price: number
  image?: string
  stock: number
  type: ItemTypes
  banner?: string
  addedAt: number
}

export default MerchantItem
export { ItemTypes }