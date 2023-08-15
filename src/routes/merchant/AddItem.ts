import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import MerchantItem from '../../types/database/MerchantItem'

// add a new item to merchant item list
class AddItemToMerchant extends Path {
  public method = 'post'
  public path = '/merchant/:uid/items'

  public async onRequest(req: ClientRequest) {
    const item = req.body<MerchantItem>('item'),
      uid = req.params('uid')

    return {
      value: await this.server.utils.merchant.addItem(item, uid),
      code: 200
    }
  }
}

export default AddItemToMerchant