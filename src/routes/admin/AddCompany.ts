import Path from '../../base/Path'
import { IRoute } from '../../types/Http'

class AddCompany extends Path implements IRoute {
  public path   = '/admin/company'
  public method = 'post'

  public adminOnly = true

  public async onRequest() {
    
  }
}

export default AddCompany