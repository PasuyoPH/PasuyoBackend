import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import Merchant from '../types/database/Merchant'
import MerchantItem from '../types/database/MerchantItem'

class MerchantUtils {
  constructor(public server: HttpServer) {}

  public async addItem(item: MerchantItem, merchant: string) {
    const data: MerchantItem = {
      ...item,
      merchant,
      uid: await this.server.utils.crypto.genUID()
    }
    
    await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .insert(data)
    
    return data
  }

  public async get(uid: string) {
    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
      .where({ uid })
      .first()
  }

  public async getItem(uid: string) {
    const result: { item?: MerchantItem, merchant?: Merchant } = {},
      item = await this.server.db.table<MerchantItem>(Tables.MerchantItems)
        .select('*')
        .where('uid', uid)
        .first()

    if (!item) return
    const merchant = await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
      .where('uid', item.merchant)
      .first()

    return { item, merchant }
  }

  public async getItems(uid: string) {
    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('*')
      .where({ merchant: uid })
  }

  public async getAllItemsById(uids: string[]) {
    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('*')
      .whereIn('uid', uids)
  }

  public async like(user: string, item: string) {
    
  }

  public async getNewItems(limit: number = 5) {
    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('*')
      .orderBy('addedAt', 'desc')
      .limit(limit)
  }

  public async getMerchants() {
    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
  }

  public async getMerchantsById(ids: string[]) {
    console.log(ids)

    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
      .whereIn('uid', ids)
  }
}

export default MerchantUtils