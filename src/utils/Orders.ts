import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Address from '../types/database/Address'
import { AddressUsed, AddressUsedType } from '../types/database/AddressUsed'
import MerchantItem from '../types/database/MerchantItem'
import Order, { OrderStatus } from '../types/database/Order'
import OrderData from '../types/http/OrderData'

class OrderUtils {
  constructor(public server: HttpServer) {}

  // create a new order of food
  // orders must all have the same merchant
  public async create(user: string, addressId: string, orders: OrderData[]) {
    // check if address is valid
    const address = await this.server.db.table<Address>(Tables.Address)
      .select('*')
      .where(
        { uid: addressId, user }
      )
      .first()

    if (!address)
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_POINTS,
        'Delivery address does not exist in this world. Maybe try something inside Earth?'
      )

    // temporary holder for last merhcant
    let lastMerchant: string = null

    // fetch all the items first
    const items = await this.server.db.table<MerchantItem>(Tables.MerchantItems)
      .select('price', 'uid', 'merchant')
      .whereIn(
        'uid',
        orders.map(
          (order) => {
            if (lastMerchant && lastMerchant !== order.merchant)
              throw new HttpError(
                HttpErrorCodes.JOB_MERCHANT_MISMATCH,
                'Please only order from one merchant at a time.'
              )

            lastMerchant = order.merchant
            return order.item
          }
        )
      )

    if (items.length < 1)
      throw new HttpError(
        HttpErrorCodes.JOB_NO_ITEMS_FOR_ORDER,
        'Oops! The items you ordered doesn\'t seem to exist. Please try again.'
      )

    // we can now calculate total price
    // same as generate the "id-quantity" array
    const ids: Record<string, number> = {},
      uid = await this.server.utils.crypto.genUID()
    let totalPrice = 0

    for (const item of items) {
      const orderData = orders.find((o) => o.item === item.uid)

      totalPrice += (item.price ?? 0) * orderData.quantity
      ids[item.uid] = (orderData.quantity ?? 0)
    }

    // save as a new order
    const order: Order = {
      uid,
      items: 
        Object.entries(ids)
          .map(([key, value]) => `${key}-${value}`)
          .join(','),
      merchant: lastMerchant,
      total: totalPrice,
      createdAt: Date.now(),
      status: OrderStatus.ORDER_PROCESSED,
      user,
      deliverTo: address.uid,
      draft: true
    }

    // get address used by merchant
    const merchantAddress = await this.server.db.table<Address>(Tables.Address)
      .select('*')
      .where(
        {
          user: order.merchant,
          merchant: true
        }
      )
      .first()

    if (!merchantAddress) return console.log('No merchant address found!')
    const calculatedDistance = await this.server.utils.math.calculateDistance(
      [
        {
          latitude: merchantAddress.latitude,
          longitude: merchantAddress.longitude
        },
        {
          latitude: address.latitude,
          longitude: address.longitude
        }
      ]
    )

    order.pf = (order.total + (order.total * .15)) * .15

    order.distance = calculatedDistance.distance
    order.total += (order.total * .15) + calculatedDistance.fee // add fee
    order.eta = calculatedDistance.eta
    
    // insert into database
    await this.server.db.table<Order>(Tables.Orders)
      .insert(order)

    // mark this as address used as well
    await this.server.utils.addresses.markAsUsed(order.uid, [merchantAddress, address])

    return order
  }
}

export default OrderUtils