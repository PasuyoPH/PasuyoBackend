import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Address from '../types/database/Address'
import Likes from '../types/database/Likes'
import Merchant from '../types/database/Merchant'
import MerchantItem from '../types/database/MerchantItem'

class MerchantUtils {
  constructor(public server: HttpServer) {}

  public async getAddresses(uid: string) {
    return await this.server.db.table<Address>(Tables.Address)
      .select('*')
  }

  public async searchItems(query: string = '') {
    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('*')
      .where(
        this.server.db.raw(
          'LOWER(name) LIKE ?',
          [`%${query.toLowerCase()}%`]
        )
      )
  }

  public async getMerchantData(uid: string) {
    const data = await this.get(uid), // get normal merchant data
      likes = await this.server.db.table<{ count: string } & Likes>(Tables.Likes) // fetch like count
        .count()
        .where('merchant', uid)
        .first(),
      items = await this.getItems(uid),
      address = await this.server.db.table<Address>(Tables.Address)
        .select('*')
        .where(
          {
            user: uid,
            merchant: true
          }
        )
        .first()

    return {
      data,
      likes: parseInt(likes.count as string),
      items,
      address
    }
  }

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

  public async unlike(user: string, uid: string) {
    const result = await this.server.db.table<Likes>(Tables.Likes)
      .delete()
      .where(
        {
          user,
          product: uid
        }
      )

    return result >= 1
  }

  public async getLikes(user: string) {
    const itemIds = await this.server.db.table<Likes>(Tables.Likes)
      .select('product')
      .where({ user })
      .pluck('product')

    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('*')
      .whereIn('uid', itemIds)
  }

  public async getLikedItem(user: string, uid: string) {
    return await this.server.db.table<Likes>(Tables.Likes)
      .select('*')
      .where(
        {
          user,
          product: uid
        }
      )
      .first()
  }

  public async like(user: string, item: string) {
    // get item data
    const itemData = await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('uid', 'merchant')
      .where('uid', item)
      .first()
    
    if (!itemData)
      throw new HttpError(
        HttpErrorCodes.LIKE_ITEM_NOT_EXIST,
        'The item that you want to like does not exist. Please try again.'
      )

    return await this.server.db.table<Likes>(Tables.Likes)
      .insert(
        {
          product: itemData.uid,
          user,
          likedAt: Date.now(),
          merchant: itemData.merchant
        }
      )
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
    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
      .whereIn('uid', ids)
  }
}

export default MerchantUtils