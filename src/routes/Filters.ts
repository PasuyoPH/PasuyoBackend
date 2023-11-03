import Path from '../base/Path'
import { RestaurantFilters } from '../types/RestaurantFilters'

class GetFilters extends Path {
  public path = '/filters'

  public async onRequest() {
    return {
      value: RestaurantFilters,
      code: 200
    }
  }
}

export default GetFilters