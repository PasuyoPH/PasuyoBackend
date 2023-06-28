import ClientRequest from '../base/ClientRequest'
import Path from '../base/Path'

class FetchRiders extends Path {
  public method = 'post'
  public path = '/fetch-riders'

  public async onRequest(req: ClientRequest) {
    const ids = req.body<string[]>('ids')

    return {
      value: await this.server.utils.fetchRiders(ids),
      code: 200
    }
  }
}

export default FetchRiders