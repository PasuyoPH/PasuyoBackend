import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

class CreateDelivery extends Path {
  public method = 'post'
  public path = '/deliveries'
  public permissions: PathPermissions = {
    check: 'user'
  }

  public async onRequest(req: ClientRequest) {
    const address = req.body<{ pickup: string, dropoff: string }>('address'),
      delivery = req.body<{ name: string, weight: number, proof: string }>('delivery')

    return {
      value: await this.server.utils.deliveries.create(
        {
          user: this.user.uid,
          address,
          delivery
        }
      ),
      code: 200
    }
  }
}

export default CreateDelivery