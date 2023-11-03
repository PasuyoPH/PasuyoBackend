import ClientRequest from '../base/ClientRequest'
import Path from '../base/Path'
import PathPermissions from '../types/path/PathPermissions'

class SearchItems extends Path {
  public method = 'get'
  public path = '/search'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const query = req.query('query') as string

    return {
      value: await this.server.utils.merchant.searchItems(query),
      code: 200
    }
  }
}

export default SearchItems