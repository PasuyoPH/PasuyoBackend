import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { ItemTypes } from '../../types/database/MerchantItem'
import PathPermissions from '../../types/path/PathPermissions'

// add a new item to merchant item list
class MerchantAddItem extends Path {
  public method = 'post'
  public path = '/merchants/@me/items'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const name = req.body<string>('name'),
      price = req.body<number>('price'),
      banner = req.body<string>('banner'),
      image = req.body<string>('image')

    return {
      value: await this.server.utils.merchant.addItem(
        this.merchant,
        { name, price, banner, image, available: false, eta: 0 }
      ),
      code: 200
    }
  }
}

export default MerchantAddItem