interface DeliveryFeeData {
  distance: number
  price: number
}

// [km:price]
const DeliveryFees: DeliveryFeeData[] = [
  {
    distance: 0,
    price: 25
  },
  // 60 C - 40 R
]

const BASE_DELIVERY_FEE = 25

interface FeeData {
  fee: number
  distance: number
  eta: number
  riderFee?: number
}

export {
  DeliveryFees,
  BASE_DELIVERY_FEE,
  FeeData
}