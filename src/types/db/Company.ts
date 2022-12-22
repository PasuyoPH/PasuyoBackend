import IDbMeal from './Meal'

// Structure for meal companies in the db
interface IDbCompany {
  name: string
  uid: string

  meals: IDbMeal[]
  desc?: string
}

export default IDbCompany