import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Address from '../types/database/Address'
import Likes from '../types/database/Likes'
import Merchant from '../types/database/Merchant'
import MerchantAccount from '../types/database/MerchantAccount'
import MerchantItem, { ItemTypes } from '../types/database/MerchantItem'
import Order from '../types/database/Order'
import NewAddressData from '../types/http/NewAddressData'

interface UpdateItemData {
  name: string
  price: number
  banner: string
  image: string
  types: ItemTypes[]
}

interface UpdateMerchantData {
  name: string
  bio: string
  banner: string
  logo: string
  types: ItemTypes[]
  accent: string
}

class MerchantUtils {
  constructor(public server: HttpServer) {}

  public async getOrders(merchant: Merchant) {
    return await this.server.db
      .select(`${Tables.Orders}.*`)
      .from(Tables.Orders)
      /*.from(Tables.Orders)
      .innerJoin(Tables.Jobs2, `${Tables.Orders}.uid`, `${Tables.Jobs2}.dataUid`)
      .where(`${Tables.Jobs2}.finished`, false)
      .where(`${Tables.Jobs2}.pickedUp`, false)*/
      .where(`${Tables.Orders}.merchant`, merchant.uid)
  }

  public async deleteItem(merchant: Merchant, uid: string) {
    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .delete()
      .where({ uid, merchant: merchant.uid })
  }

  public async newAddress(data: NewAddressData, merchant: Merchant) {
    if (
      !data?.template ||
      data?.template.length < 3
    )
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_NOTE,
        'Your address template name must be at least 3 characters long.'
      )

    if (
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    )
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_GEOLOCATION,
        'Invalid latitude/longitude points provided.'
      )

    if (typeof data.text !== 'string')
      throw new HttpError(
        HttpErrorCodes.ADDRESS_INVALID_FORMATTED_ADDRESS,
        'Invalid text address provided.'
      )

    data.contactName = merchant.name
    data.contactPhone = 'N/A'

    const address: Address = {
      ...data,
      user: merchant.uid,
      uid: await this.server.utils.crypto.genUID(),
      createdAt: Date.now(),
      merchant: true
    }

    await this.server.db.table<Address>(Tables.Address)
      .insert(address)

    return address
  }

  public async getToken(username: string, password: string) {
    const merchant = await this.server.db.table<MerchantAccount>(Tables.MerchantAccounts)
      .select('uid')
      .where({ username, password })
      .first()

    if (!merchant)
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_ACCOUNT,
        'Invalid merchant account provided. Please try again.'
      )
    else return await this.server.utils.tokens.encrypt(
      { uid: merchant.uid, password },
      86400
    )
  }

  public async updateMerchant(merchant: Merchant, data: UpdateMerchantData) {
    if (data.name.length < 1)
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_UPDATE_DATA,
        'Make sure to supply all fields needed.'
      )

    return await this.server.db.table<Merchant>(Tables.Merchant)
      .update(data)
      .where({ uid: merchant.uid })
  }

  public async updateItem(merchant: Merchant, uid: string, data: UpdateItemData) {
    if (data.name.length < 1 || isNaN(data.price))
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_UPDATE_DATA,
        'Make sure to supply all fields needed.'
      )

    return await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .update(data)
      .where({ uid, merchant: merchant.uid })
  }

  public async getAddresses(uid: string) {
    return await this.server.db.table<Address>(Tables.Address)
      .select('*')
      .where({ user: uid, merchant: true })
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

  public async addItem(merchant: Merchant, item: UpdateItemData) {
    if (!item.name || item.name.length < 1)
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_NAME,
        'Please provide a proper name for the item.'
      )

    if (isNaN(item.price) || item.price < 1 || item.price > 65535)
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_PRICE,
        'Invalid price provided. Make sure it\'s >= 1 and <= 65535'
      )

    if (!item.banner || !item.image)
      throw new HttpError(
        HttpErrorCodes.MERCHANT_INVALID_IMAGES,
        'Please provide proper images for the items.'
      )

    const data: MerchantItem = {
      merchant: merchant.uid,
      uid: await this.server.utils.crypto.genUID(),
      addedAt: Date.now(),
      type: 4,
      stock: 0,
      ...item,
      types: `{${item.types.join(',')}}` as any
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