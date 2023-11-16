enum ItemTypes {
  PIZZA,
  CHICKEN,
  BR_BR_COLD_ASS_CREAM_NIGGA,
  BURGER,
  OTHER, // for unspecified
}

interface MerchantItem {
  // default data
  uid: string
  merchant: string
  addedAt: number

  // customizable data
  name: string
  price: number
  image?: string // logo
  banner?: string // banner image to display
  eta?: number

  // state data
  available?: boolean
  hidden?: boolean
}

export default MerchantItem
export { ItemTypes }