import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetNewItems extends Path {
  public method = 'get'
  public path = '/items/new'

  public async onRequest(req: ClientRequest) {
    const limit = Number(req.params('limit') ?? '5')

    return {
      value: await this.server.utils.merchant.getNewItems(limit),
      code: 200
    }
  }
}

export default GetNewItems