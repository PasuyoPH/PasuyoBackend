interface IRate {
  uid: string // uid of the rate
  rider: string // uid of the rider

  comment: string
  rating: number // 1 - 5 (double)

  by: string // uid of the customer who rated
}

export default IRate