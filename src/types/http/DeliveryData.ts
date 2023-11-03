interface DeliveryData {
  user: string
  address: { pickup: string, dropoff: string }
  delivery: { name: string, weight: number, proof: string }
}

export default DeliveryData