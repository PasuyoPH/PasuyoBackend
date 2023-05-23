interface V2Product {
  uid: string
  name: string
  price: number
  image: string
  sales: number
  merchant: string
  desc?: string
  available?: boolean
}

export default V2Product