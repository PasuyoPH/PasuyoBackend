import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Delivery, { DeliveryStatus } from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'
import { Rider } from '../types/database/Rider'
import DeliveryData from '../types/http/DeliveryData'

class DeliveryUtils {
  constructor(public server: HttpServer) {}

  public async deleteDraft(uid: string, user: string) {
    return await this.server.db.table<Delivery>(Tables.Deliveries)
      .delete()
      .where({ uid, user })
  }
  
  public async getActiveCount(user: string) {
    const deliveries = await this.server.db
      .select(
        `${Tables.Deliveries}.*`,
        this.server.db.raw(
          `COALESCE(${Tables.Jobs2}.finished, :default) AS finished`,
          { default: false }
        )
      )
      .from(Tables.Deliveries)
      .where(`${Tables.Deliveries}.user`, user)
      .where(`${Tables.Deliveries}.type`, JobTypes.DELIVERY)
      .where(`${Tables.Deliveries}.draft`, false)
      .leftJoin(Tables.Jobs2, `${Tables.Deliveries}.uid`, `${Tables.Jobs2}.uid`)
      .where(
        (builder) => builder.whereNull(`${Tables.Jobs2}.finished`)
          .orWhere(`${Tables.Jobs2}.finished`, '!=', true)
      )

    return deliveries.length
  }

  public async getDeliveries(user: string) {
    const deliveries = await this.server.db.table<Delivery>(Tables.Deliveries)
      .select('*')
      .where('user', user),
      allRiders = await this.server.db.table<Rider>(Tables.Riders)
        .select('*')
        .whereIn('uid', deliveries.map((delivery) => delivery.rider))

    const riders: Record<string, Rider> = allRiders.reduce(
      (acc, rider) => {
        acc[rider.uid] = rider
        return acc
      },
      {}
    )

    return { deliveries, riders }
  }

  // create a new delivery
  public async create(data: DeliveryData) {
    if (
      typeof data?.delivery?.name !== 'string' ||
      isNaN(data?.delivery?.weight as any)
    )
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_DELIVERY,
        'Invalid delivery data was provided. Please try again.'
      )

    if (typeof data.delivery.proof !== 'string')
      throw new HttpError(
        HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide an image of your item to deliver.'
      )

    if (data.address?.pickup === data.address?.dropoff)
      throw new HttpError(
        HttpErrorCodes.JOB_ADDRESS_CANT_BE_SAME,
        'The two addresses can\'t be the same. Please try again.'
      )

    // check if address is valid
    const addresses = await this.server.utils.addresses.get([data.address?.pickup, data.address?.dropoff])
    if (addresses.length < 2)
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_POINTS,
        'Delivery address does not exist in this world. Maybe try something inside Earth?'
      )

    // no need to validate any items, instead calculate the price instantly, and this delivery will be marked as draft
    const distance = await this.server.utils.math.calculateDistance(addresses),
      delivery: Delivery = {
        uid: await this.server.utils.crypto.genUID(),
        name: data.delivery.name,
        weight: data.delivery.weight,
        createdAt: Date.now(),
        user: data.user,
        deliverTo: data.address.dropoff,
        distance: distance.distance,
        eta: distance.eta,
        fee: Math.ceil(distance.fee),
        riderFee: distance.riderFee,
        draft: true,
        status: DeliveryStatus.DELIVERY_PROCESSED,
        image: data.delivery.proof // item
      }

    // save to database
    await this.server.db.table(Tables.Deliveries)
      .insert(delivery)

    // mark as used
    await this.server.utils.addresses.markAsUsed(delivery.uid, addresses)

    return delivery
  }
}

export default DeliveryUtils