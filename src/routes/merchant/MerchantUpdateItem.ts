import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { ItemTypes } from '../../types/database/MerchantItem'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantUpdateItem extends Path {
  public method = 'patch'
  public path = '/merchants/@me/items/:uid'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      name = req.body<string>('name') ?? undefined,
      price = req.body<number>('price') ?? undefined,
      banner = req.body<string>('banner') ?? undefined,
      image = req.body<string>('image') ?? undefined,
      available = req.body<boolean>('available') ?? undefined,
      eta = req.body<number>('eta') ?? undefined

    return {
      value: await this.server.utils.merchant.updateItem(
        this.merchant,
        uid,
        { name, price, banner, image, available, eta }
      ),
      code: 200
    }
  }
}

export default MerchantUpdateItem