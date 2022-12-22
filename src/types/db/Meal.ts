//  Structure for meals in the db
interface IDbMeal {
  name: string
  price: number

  uid: string
  desc?: string
}

export default IDbMeal