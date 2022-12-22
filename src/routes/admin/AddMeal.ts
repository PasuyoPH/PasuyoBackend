import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class AddMeal extends Path implements IRoute {
  public path   = '/admin/meal'
  public method = 'post'

  public adminOnly = true

  public async onRequest() {
    
  }
}

export default AddMeal