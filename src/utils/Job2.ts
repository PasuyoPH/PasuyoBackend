import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import { AddressUsed, AddressUsedType } from '../types/database/AddressUsed'
import Delivery, { DeliveryStatus } from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'
import Job2 from '../types/database/Job2'
import Merchant from '../types/database/Merchant'
import MerchantItem from '../types/database/MerchantItem'
import Order, { OrderStatus } from '../types/database/Order'
import { Rider, RiderStates } from '../types/database/Rider'
import User from '../types/database/User'

// Move this as Job when code is production ready
class Job2Utils {
  constructor(public server: HttpServer) {}

  public async markAsDone(rider: Rider, uid: string) {
    await this.server.db.table<Rider>(Tables.Riders)
      .update(
        {
          ...rider,
          state: RiderStates.RIDER_ONLINE
        }
      )
      .where({ uid: rider.uid })

    return await this.server.db.table<Job2>(Tables.Jobs2)
      .update({ finished: true })
      .where({ uid })
  }

  public async pickedUp(uid: string) {
    return await this.server.db.table<Job2>(Tables.Jobs2)
      .update({ pickedUp: true })
      .where({ uid })
  }

  public async getMap(rider: string) { // fetch all data required for map (e.g addresses contact info of user)
    const job = await this.server.db.table<Job2>(Tables.Jobs2)
      .select('*')
      .where({ rider, finished: false })
      .first()

    if (!job) return console.log('WA no jbo')

    const addresses: { pickup?: AddressUsed, dropoff?: AddressUsed } = {},
      addressesUsed = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
        .select('*')
        .where('jobUid', job.dataUid)

    for (const address of addressesUsed) {
      switch (address.type) {
        case AddressUsedType.START:
          addresses.pickup = address
          break

        case AddressUsedType.END:
          addresses.dropoff = address
          break
      }
    }

    const user = await this.server.db.table<User>(Tables.Users)
      .select('*')
      .where({ uid: job.user })
      .first()

    return { addresses, user }
  }

  public async getUserJobs(user: string, draft: boolean = false) {
    const orderIds = await this.server.db.table<Order>(Tables.Orders)
      .select('uid')
      .where({ user, draft }),
      deliveryIds = await this.server.db.table<Delivery>(Tables.Deliveries)
        .select('uid')
        .where({ user, draft })

    return await this.getJobsData(
      [
        ...(orderIds.map((i) => i.uid)),
        ...(deliveryIds.map((i) => i.uid))
      ] as any as string[])
  }

  public async getJobsData(uids: string[]): Promise<{ jobs: (Order | Delivery)[], statuses: { uid: string, finished?: boolean, pickedUp?: boolean }[] }> {
    try {  
      const deliveriesQuery = await this.server.db
        .select('*')
        .from('deliveries')
        .whereIn('uid', uids),
        statuses = (
          await this.server.db<Job2>(Tables.Jobs2)
            .select('uid', 'finished', 'pickedUp')
            .whereIn('uid', uids)
        )
  
      const mergedResults = [...deliveriesQuery]
  
      // Check for missing IDs and fetch from Orders table
      const foundIds = deliveriesQuery.map(item => item.uid)
      const missingIds = uids.filter(id => !foundIds.includes(id))
  
      if (missingIds.length > 0) {
        const missingOrdersQuery = await this.server.db
          .select('*')
          .from('orders')
          .whereIn('uid', missingIds)
  
        const missingOrdersResult = missingOrdersQuery
        mergedResults.push(...missingOrdersResult)

        return { jobs: mergedResults, statuses }
      } else {
        return { jobs: deliveriesQuery, statuses }
      }
    } catch (error) {
      console.error('Error:', error)
      return { jobs: [], statuses: [] }
    }
  }

  // todo: make optomized version
  public async getData(uid: string, type: JobTypes) {
    const addresses: { pickup?: AddressUsed, dropoff?: AddressUsed } = {},
      result: { order?: Order, delivery?: Delivery } = {},
      person: { rider?: Rider, user?: User, merchant?: Merchant } = {},
      extra: { items?: Record<string, { quantity: number, item: MerchantItem }> } = { items: {} },
      job: Job2 = await this.server.db.table<Job2>(Tables.Jobs2)
        .select('*')
        .where('uid', uid)
        .first()

    switch (type) {
      case JobTypes.DELIVERY: {
        const delivery = await this.server.db.table<Delivery>(Tables.Deliveries)
          .select('*')
          .where('uid', uid)
          .first()

        if (!delivery) return console.log('NO DELIVERY')
        const addressesUsed = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
          .select('*')
          .where('jobUid', uid)
          
          
        for (const address of addressesUsed) {
          switch (address.type) {
            case AddressUsedType.START:
              addresses.pickup = address
              break

            case AddressUsedType.END:
              addresses.dropoff = address
              break
          }
        }

        result.delivery = delivery

        if (delivery.rider) {
          // get rider
          const rider = await this.server.db.table<Rider>(Tables.Riders)
            .select('*')
            .where('uid', delivery.rider)
            .first()

          if (!rider) return console.log('NO DELIVERY RIDER') // throw new error
          person.rider = rider
        }

        // get  author
        const user = await this.server.db.table<User>(Tables.Users)
          .select('*')
          .where('uid', delivery.user)
          .first()

        if (!user) return console.log('NO DELIVERY USER') // throw new error
        person.user = user
      } break

      case JobTypes.ORDER: {
        const order = await this.server.db.table<Order>(Tables.Orders)
          .select('*')
          .where('uid', uid)
          .first()

        if (!order) return console.log('NO ORDER')
        const addressesUsed = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
          .select('*')
          .where('jobUid', uid)

        for (const address of addressesUsed) {
          switch (address.type) {
            case AddressUsedType.START:
              addresses.pickup = address
              break

            case AddressUsedType.END:
              addresses.dropoff = address
              break
          }
        }

        result.order = order
        
        if (order.rider) {
          // get rider
          const rider = await this.server.db.table<Rider>(Tables.Riders)
            .select('*')
            .where('uid', order.rider)
            .first()

          if (!rider) return console.log('NO ORDER RIDER') // throw new error
          person.rider = rider
        }

        // get  author
        const user = await this.server.db.table<User>(Tables.Users)
          .select('*')
          .where('uid', order.user)
          .first()

        if (!user) return console.log('NO ORDER USER')// throw new error
        person.user = user

        // get merchant
        const merchant = await this.server.db.table<Merchant>(Tables.Merchant)
          .select('*')
          .where('uid', order.merchant)
          .first()

        if (!merchant) return // throw error
        person.merchant = merchant

        // get all items
        const orderItems = order.items.split(','), // format before: ID-AMOUNT,ID-AMOUNT,
          ids: string[] = []

        const fetchItemPromises = orderItems.map(
          async (item) => {
            const [itemUid, amount] = item.split('-')
            extra.items[itemUid] = {
              quantity: Number(amount),
              item: null
            }
      
          
            ids.push(itemUid)
          }
        )
      
        // Wait for all item data to be fetched in parallel
        await Promise.all(fetchItemPromises)
      
        // Fetch all item data in parallel
        const items = await this.server.db.table<MerchantItem>(Tables.MerchantItems)
          .select('*')
          .whereIn('uid', ids)
      
        // Map the fetched items to the extra object
        items.forEach(
          (item) => extra.items[item.uid].item = item
        )
      } break
    }
    
    return {
      data: result,
      addresses,
      person,
      extra,
      uid,
      job
    }
  }

  // Takes the job for the rider
  public async take(rider: Rider, uid: string, type: JobTypes) {
    const jobsByRider = await this.server.db.table<Job2>(Tables.Jobs2)
      .select('uid')
      .where(
        {
          rider: rider.uid,
          finished: false
        }
      )

    if (jobsByRider.length >= 1)
      throw new HttpError(
        HttpErrorCodes.JOB_RIDER_HAS_JOB,
        'Rider already has a job. Please finish your current job first.'
      )

    switch (type) {
      case JobTypes.ORDER: { // handle food orders
        const order = await this.server.db.table<Order>(Tables.Orders)
          .select('*')
          .where('uid', uid)
          .first()

        if (!order)
          throw new HttpError(
            HttpErrorCodes.ORDER_NOT_FOUND,
            'This order can\'t be found. Please make sure you provided the right id.'
          )

        // update orders
        await this.server.db.table<Order>(Tables.Orders)
          .update(
            {
              rider: rider.uid,
              status: OrderStatus.ORDER_PROCESSED,
              startedAt: Date.now()
            }
          )
          .where({ uid })

        // insert new data to jobs table
        await this.server.db.table<Job2>(Tables.Jobs2)
          .insert(
            {
              uid: order.uid, // use order uid instead
              rider: rider.uid,
              user: order.user,
              type: JobTypes.ORDER,
              dataUid: order.uid,
              createdAt: Date.now(),
              finished: false
            }
          )
      } break

      case JobTypes.DELIVERY: { // handle delivery
        const delivery = await this.server.db.table<Delivery>(Tables.Deliveries)
          .select('*')
          .where('uid', uid)
          .first()

        if (!delivery)
          throw new HttpError(
            HttpErrorCodes.DELIVERY_MISSING_DATA,
            'This delivery can\'t be found. Please make sure you provided the right id.'
          )

        // update delivery
        await this.server.db.table<Delivery>(Tables.Deliveries)
          .update(
            {
              rider: rider.uid,
              status: DeliveryStatus.DELIVERY_PROCESSED,
              startedAt: Date.now()
            }
          )
          .where({ uid })

        // insert new data to jobs table
        await this.server.db.table<Job2>(Tables.Jobs2)
          .insert(
            {
              uid: delivery.uid, // use order uid instead
              rider: rider.uid,
              user: delivery.user,
              type: JobTypes.DELIVERY,
              dataUid: delivery.uid,
              createdAt: Date.now(),
              finished: false
            }
          )
      } break

      default: {
        throw new HttpError(
          HttpErrorCodes.JOB_INVALID_TYPE,
          'This type of service is not yet supported. Please try again.'
        )
      }
    }

    // set rider has job
    await this.server.db.table<Rider>(Tables.Riders)
      .update(
        {
          ...rider,
          state: RiderStates.RIDER_UNAVAILABLE
        }
      )
      .where({ uid: rider.uid })

    return 'OK'
  }
}

export default Job2Utils