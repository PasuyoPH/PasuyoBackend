import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetItems extends Path {
  public method = 'get'
  public path = '/items'

  public async onRequest(req: ClientRequest) {
    const ids = (req.query('ids') as string ?? '')
      .split(',')

    return {
      value: await this.server.utils.merchant.getAllItemsById(ids),
      code: 200
    }
  }
}

export default GetItems