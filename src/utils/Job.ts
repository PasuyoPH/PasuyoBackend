import { start } from 'repl'
import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import { PickupPaymentTypes, Services } from '../types/Services'
import Tables from '../types/Tables'
import Address from '../types/database/Address'
import { AddressUsed, AddressUsedType } from '../types/database/AddressUsed'
import Job, { JobStatus, JobTypes } from '../types/database/Job'
import { Rider, RiderStates } from '../types/database/Rider'
import NewJobData from '../types/http/NewJobData'
import User from '../types/database/User'
import WebSocket from 'ws'
import MerchantItem from '../types/database/MerchantItem'
import Merchant from '../types/database/Merchant'

class JobUtils {
  constructor(public server: HttpServer) {}

  public async getRider(uid: string, user: string) {
    const job = await this.server.db.table<Job>(Tables.Jobs)
      .select('user', 'rider')
      .where(
        {
          uid,
          draft: false
        }
      )
      .first()

    if (!job)
      throw new HttpError(
        HttpErrorCodes.JOB_NOT_EXIST,
        'Failed to get job rider. This job does not exist.'
      )
    
    if (job.user !== user)
      throw new HttpError(
        HttpErrorCodes.JOB_USER_MISMATCH,
        'You are unauthorized to fetch this data as there is a user id mismatch.'
      )

    const rider = await this.server.db.table<Rider>(Tables.Riders)
      .select('uid', 'profile', 'phone', 'fullName', 'email')
      .where('uid', job.rider)
      .first()

    return rider ?? null
  }

  // id of user
  public async getJobAuthor(uid: string) {
    return await this.server.db.table<User>(Tables.Users)
      .select(
        'createdAt',
        'fullName',
        'phone',
        'profile',
        'uid',
        'email'
      )
      .where({ uid })
      .first()
  }

  public async getJobRiderFee(uid: string, rider: Rider) {
    const job = await this.server.db.table<Job>(Tables.Jobs)
      .select('fee')
      .where({ uid })
      .first(),
      rate = this.server.utils.math.getRiderRates(rider)

    return (job?.fee ?? 0) * rate
  }

  public async getAddressUsed(uid: string) {
    return await this.server.db.table<AddressUsed>(Tables.AddressUsed)
      .select('*')
      .where({ jobUid: uid })
  }

  public async getUserJobs(uid: string) {
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where(
        {
          user: uid,
          draft: false
        }
      )
      .where('status', '<', JobStatus.DONE)
  }

  /**
   * Fetches available and nearest jobs for a rider
   * @param latitude The latitude of the rider
   * @param longitude The longitude of the rider
   * @param rider The rider to fetch jobs for
   */
  public async getAvailableJobs(
    latitude: number,
    longitude: number,
    rider: Rider
  ) {
    const nearestJobsQuery = this.server.db.table<Job>(Tables.Jobs)
      .select(
        `${Tables.Jobs}.*`,
        `${Tables.AddressUsed}.longitude`,
        `${Tables.AddressUsed}.latitude`,
        `${Tables.AddressUsed}.jobUid`
      )
      .join(
        Tables.AddressUsed,
        `${Tables.Jobs}.uid`,
        '=',
        `${Tables.AddressUsed}.jobUid`
      )
      .where(
        {
          status: JobStatus.PROCESSED,
          draft: false
        }
      )
      .orderByRaw(
        `ST_DistanceSphere(
          ST_MakePoint(${Tables.AddressUsed}.longitude, ${Tables.AddressUsed}.latitude),
          ST_MakePoint(:longitude, :latitude)
        ) ASC`,
        { latitude, longitude }
      )
      .limit(5),
      jobsByDateQuery = this.server.db.table<Job>(Tables.Jobs)
        .select('*')
        .where(
          (firstBuilder) => firstBuilder.where(
              {
                status: JobStatus.PROCESSED,
                draft: false
              }
            )
            .orWhere(
              (secondBuilder) => secondBuilder.where({ rider: rider.uid })
                .whereNotIn(
                  'status',
                  [
                    JobStatus.PROCESSED,
                    JobStatus.DONE
                  ]
                )
            )
        )
        .orderBy('createdAt', 'desc')

    const [available, nearest] = await Promise.all(
      [jobsByDateQuery, nearestJobsQuery]
    )

    return {
      available,
      nearest: Array.from(
        nearest.reduce(
          (map, obj: Job) => {
            // delete unused properties
            delete obj['latitude']
            delete obj['longitude']
            delete obj['jobUid']

            return map.set(obj.uid, obj)
          },
          new Map()
        ).values()
      ).slice(0, 5)
    }

  }

  /**
   * Get all addresses of a job.
   * @param uid The id of the rider.
   */
  public async getJobAddresses(uid: string): Promise<AddressUsed[]> {
    return await this.server.db.table<AddressUsed>(Tables.AddressUsed)
      .select('*')
      .where('jobUid', uid)
      .join(
        Tables.Address,
        `${Tables.AddressUsed}.addressUid`,
        '=',
        `${Tables.Address}.uid`
      )
  }

  /**
   * Complete a job and upload the file to s3 storages.
   * @param uid The id of the user who made the job.
   * @param rider The rider who will complete the job.
   * @param file The file to upload
   */
  public async complete(
    uid: string,
    rider: Rider,
    file: Buffer
  ) {
    if (!Buffer.isBuffer(file))
      throw new HttpError(
        HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide an image of proof to complete the job.'
      )

    const fileUrl = await this.server.utils.uploadFile(
      {
        storage: 'evidences',
        file
      }
    )

    await this.server.db.transaction(
      async (trx) => {
        const job = (
            await trx.table<Job>(Tables.Jobs)
            .update(
              {
                status: JobStatus.DONE,
                finishedAt: Date.now(),
                proof: fileUrl
              }
            )
            .where({ uid })
            .returning('*')
          )[0],
          xpAdded = await this.server.utils.math.calculateXp(job.distance),
          result = await trx.table<Rider>(Tables.Riders)
            .update(
              {
                state: RiderStates.RIDER_ONLINE,
                xp: this.server.db.raw('xp + ?', [xpAdded])
              }
            )
            .where({ uid: rider.uid })
            .returning('*')

        // TODO: Update rider data if rider > 0 to ws
        if (result.length > 0) {
          await this.server.utils.ws.updateUserToWs(result[0])
        }
        // TODO: Send notification

        // Update address used
        // Delete them from the database to mark as unused.
        await this.server.db.table<AddressUsed>(Tables.AddressUsed)
          .delete()
          .where('jobUid', job.uid)
      }
    )
  }

  /**
   * Deletes a user's job.
   * @param user The id of the user who made the job.
   * @param uid The id of the job to delete.
   * @returns Boolean whether job is deleted.
   */
  public async delete(user: string, uid: string) {
    const result = await this.server.db.table<Job>(Tables.Jobs)
      .delete()
      .where(
        {
          uid,
          user,
          draft: false
        }
      )

    return result >= 1
  }

  /**
   * Gets a specific job made by a user
   * @param uid The id of the job.
   * @param user The id of the user who made the job.
   */
  public async get(uid: string, user?: string) {
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where(
        {
          uid,
          draft: false,
          ...(
            user ? (
              { user }
            ) : {}
          )
        }
      )
      .first()
  }

  /**
   * Get all jobs that aren't finished of a user.
   * @param user The id of the user who made the jobs.
   */
  public async all(user: string) {
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where(
        {
          user,
          draft: false
        }
      )
      .where('status', '<', JobStatus.DONE)
  }

  /**
   * Fetches all finished jobs of a user.
   * @param user The id of the user who made the jobs.
   */
  public async getHistory(user: string) {
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where(
        {
          user,
          status: JobStatus.DONE
        }
      )
  }

  /**
   * Delete a user's job draft.
   * @param user The id of the user who made the draft.
   * @param uid The id of the draft.
   */
  public async deleteDraft(user: string, uid: string) {
    const result = await this.server.db.table<Job>(Tables.Jobs)
      .delete()
      .where(
        {
          user,
          uid,
          draft: true
        }
      )

    return result >= 1
  }

  /**
   * Gets all the user's job drafts.
   * @param user The id of the user who made the drafts.
   */
  public async getDrafts(user: string) {
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where(
        {
          user,
          draft: true
        }
      )
  }

  /**
   * Finalize a job, removing it from draft status.
   * @param uid The id of the job to finalize.
   * @param user The id of the user who made the job.
   */
  public async finalize(uid: string, user: string) {
    const job = await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where({ uid, user })
      .first()

    if (!job) return null // TODO: Throw error saying job is deleted
    job.draft = false

    await this.server.db.table<Job>(Tables.Jobs)
      .update(job)
      .where({ uid: job.uid })
  
    // Notify riders via ws
    if (this.server.config.ws.enabled) {
      // fetch address used
      const startAddress = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
        .select('latitude', 'longitude')
        .where(
          {
            jobUid: job.uid,
            type: AddressUsedType.START
          }
        )
        .first()

      if (startAddress) // send job if found address
        await this.server.ws.send(
          JSON.stringify(
            {
              c: 2,
              d: {
                uid: job.uid,
                geo: {
                  latitude: startAddress.latitude,
                  longitude: startAddress.longitude
                }
              }
            }
          )
        )
    }

    return job
  }

  /**
   * Accept a job made by a user.
   * @param uid The id of the job to accept.
   * @param rider The rider who will accept the job.
   */
  public async accept(uid: string, rider: Rider) {
    const transaction = await this.server.db.transaction(
      async (trx) => {
        const job = await trx.table<Job>(Tables.Jobs)
          .select('*')
          .where({ uid })
          .where('status', JobStatus.PROCESSED)
          .whereNull('rider')
          .first()

        if (!job)
          throw new HttpError(
            HttpErrorCodes.JOB_FAILED_TO_ACCEPT,
            'This job can\'t be accepted. It doesn\'t exist, or its status is not PROCESSED, or it already has a rider assigned.'
          )

        if (job.draft)
          throw new HttpError(
            HttpErrorCodes.JOB_IS_DRAFT,
            'Job is a draft. This can\'t be accepted until marked as processed.'
          )

        const fee = job.fee * this.server.utils.math.getRiderRates(rider),
          updatedRider = await trx.table<Rider>(Tables.Riders)
            .where(
              {
                uid: rider.uid,
                state: RiderStates.RIDER_ONLINE
              }
            )
            .where('credits', '>=', fee)
            .update(
              {
                credits: rider.credits - fee,
                state: RiderStates.RIDER_UNAVAILABLE
              }
            )
            .returning('*')

        if (updatedRider.length < 1)
          throw new HttpError(
            HttpErrorCodes.JOB_NO_CREDITS_OR_NOT_OFFLINE,
            'You do not have enough credits for this job, or your rider status is not ONLINE.'
          )

        // TODO: update to riders ws
        // Send to ws
        if (this.server.config.ws.enabled) {
          await this.server.utils.ws.updateUserToWs(updatedRider[0])
          if (!this.server.ws || this.server.ws.readyState !== WebSocket.OPEN) return

          // Send to ws for updating data
          this.server.ws.send(
            JSON.stringify(
              {
                c: 3,
                d: { uid: job.uid }
              }
            )
          )
        }

        // Update job info
        await trx.table<Job>(Tables.Jobs)
          .where({ uid: job.uid })
          .update(
            {
              rider: rider.uid,
              status: JobStatus.ACCEPTED,
              startedAt: Date.now(),
              riderFee: fee
            }
          )

        return job
      }
    )

    return transaction
  }

  public async create(data: NewJobData, user: string) {
    const service = Services.find(
      (s) => s.type === data.type
    )

    if (!service)
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_TYPE,
        'Invalid job type was provided. Please make sure to place the correct type.'
      )

    const uid = await this.server.utils.crypto.genUID(),
      job = {
        uid,
        user,
        type: data.type,
        status: JobStatus.PROCESSED,
        createdAt: null,
        draft: true,
        cashPickup: null
      }

    switch (data.type) {
      case JobTypes.DELIVERY: {
        if (
          !Array.isArray(data.points) ||
          data.points.length < 2
        )
          throw new HttpError(
            HttpErrorCodes.JOB_INVALID_POINTS,
            'Invalid location points where provided. Please make sure there are atleast 2.'
          )

        if (
          typeof data.item !== 'string' ||
          isNaN(data.weight as any)
        )
          throw new HttpError(
            HttpErrorCodes.JOB_INVALID_DELIVERY,
            'Invalid delivery data was provided. Please try again.'
          )

        job.cashPickup = data.cashPickup
        
        const points = await this.server.utils.addresses.get(data.points)
        if (points.length < 2)
          throw new HttpError(
            HttpErrorCodes.JOB_INVALID_POINTS,
            'Invalid location points where provided.'
          )

        const distance = await this.server.utils.math.calculateDistance(points),
          jobInsertData: Job = {
            ...job,
            ...distance,
            createdAt: Date.now(),
            item: data.item,
            weight: data.weight
          }

        // save to database
        await this.server.db.table(Tables.Jobs)
          .insert(jobInsertData)

        // mark addresses as used
        await this.server.utils.addresses.markAsUsed(job.uid, points)
        return jobInsertData // return the inserted job data
      } 

      case JobTypes.ORDER: { // this is expected only 1 point to be given
        if (
          !Array.isArray(data.points) ||
          data.points.length !== 1
        )
          throw new HttpError(
            HttpErrorCodes.JOB_INVALID_POINT_AMOUNT,
            'Please make sure that there is only one address provided for this type of job.'
          )

        // Filter and combine all orders, prepare to insert to orders table
        const orders: { [key: string]: number } = {} // key is item id, value is quantity

        for (let i = 0; i < data.orders.length; i++) {
          const prev = data.orders[i - 1],
            curr = data.orders[i],
            next = data.orders[i + 1]

          if (
            (prev && prev.merchant !== curr.merchant) || // check if previous item in list does not match current merchant
            (next && next.merchant !== curr.merchant) // check if next item in list does not match current merchant
          )
            throw new HttpError(
              HttpErrorCodes.JOB_MERCHANT_MISMATCH,
              'You can only buy products from 1 merchant at a time.'
            )

          if (curr.quantity < 1) continue // ignore less than 1 quantities
          else orders[curr.item] = (orders[curr.item] ?? 0) + curr.quantity // add quantity
        }

        // Do database stuff
        const job = await this.server.db.transaction( // use a transaction to keep it safe and clean in case of fuck-ups
          async (trx) => {
            // Fetch merchant items from database to check
            const items = await trx<MerchantItem>(Tables.MerchantItems)
              .select('*')
              .whereIn('uid', Object.keys(orders))
              
            if (items.length < 1)
              throw new HttpError(
                HttpErrorCodes.JOB_NO_ITEMS_FOR_ORDER,
                'Please make sure to order atleast one item.'
              )

            const merchantId = data.orders[0].merchant,
              // get addresses
              merchantAddress = await trx<Address>(Tables.Address)
                .select('*')
                .where(
                  {
                    user: merchantId,
                    merchant: true
                  }
                )
                .first()
                
            if (!merchantAddress)
              throw new HttpError(
                HttpErrorCodes.JOB_MERCHANT_CANT_LOCATE,
                'We sadly can\'t locate where the merchant is. Try again later.'
              )

            // we now have the first address, we need to get the final address.
            // client should provide us the id of the address to use
            const [endAddress] = await this.server.utils.addresses.get(data.points),
              points = [merchantAddress, endAddress],
              distance = await this.server.utils.math.calculateDistance(points),
              jobInsertData: Job = {
                ...job,
                ...distance,
                createdAt: Date.now(),
                cashPickup: PickupPaymentTypes.DROPOFF, // pickup cash at end
              }

            // save job draft
            await this.server.db.table(Tables.Jobs)
              .insert(jobInsertData)

            // insert orders to another table
            await this.server.utils.orders.addItem(job.uid, data.orders)

            // mark addresses as used
            await this.server.utils.addresses.markAsUsed(job.uid, points)
            return jobInsertData // return the inserted job data to the transaction
          }
        )

        // return job data
        return job
      }
    }
  }
  
  /**
   * Creates a new job preview.
   * @param data The data of the new job.
   * @param user The user who made the job
   */
  public async createOld(data: NewJobData, user: string) {
    const service = Services.find(
      (s) => s.type === data.type
    )

    if (!service)
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_TYPE,
        'Invalid job type was provided. Please make sure to place the correct type.'
      )

    if (
      !Array.isArray(data.points) ||
      data.points.length < 2
    )
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_POINTS,
        'Invalid location points where provided. Please make sure there are atleast 2.'
      )

    switch (data.type) {
      case JobTypes.DELIVERY:
        if (
          typeof data.item !== 'string' ||
          isNaN(data.weight as any)
        )
          throw new HttpError(
            HttpErrorCodes.JOB_INVALID_DELIVERY,
            'Invalid delivery data was provided. Please try again.'
          )
        break
      
      default:
        throw new HttpError(
          0,
          'This job type is still unhandled. Please choose a different type of job.'
        )
    }

    const points = await this.server.utils.addresses.get(data.points)
    if (points.length < 2)
      throw new HttpError(
        HttpErrorCodes.JOB_INVALID_POINTS,
        'Invalid location points where provided.'
      )

    const uid = await this.server.utils.crypto.genUID(),
      dateNow = Date.now(),
      distance = await this.server.utils.math.calculateDistance(points),
      job: Job = {
        uid,
        user,
        type: data.type,
        status: JobStatus.PROCESSED,
        createdAt: dateNow,
        draft: true,
        cashPickup: data.cashPickup,
        ...distance
      }

    switch (job.type) {
      case JobTypes.DELIVERY:
        job.item = data.item
        job.weight = data.weight
        break

      default: break
    }

    // save data to database
    await this.server.db.table(Tables.Jobs)
      .insert(job)

    // Insert addresses as being used
    await this.server.db.table<AddressUsed>(Tables.AddressUsed)
      .insert(
        points.map(
          (point, idx) => {
            return {
              addressUid: point.uid,
              latitude: point.latitude,
              longitude: point.longitude,
              jobUid: job.uid,
              type: idx === 0 ?
                AddressUsedType.START : (
                  idx === points.length - 1 ?
                    AddressUsedType.END :
                    AddressUsedType.MID
                ),
              index: idx !== 0 && idx !== points.length - 1 ?
                idx - 1 :
                -1,
              createdAt: dateNow,
              
              text: point.text,
              landmark: point.landmark
            }
          }
        )
      )

    return job
  }
  
  /**
   * Update the status of a job.
   * @param uid The id of the job to update.
   * @param status The new status.
   * @param rider The rider who is managing the job.
   */
  public async updateJobStatus(
    uid: string,
    status: JobStatus,
    rider: Rider
  ) {
    if (
      typeof status !== 'number' ||
      status <= JobStatus.CANCELLED ||
      status >= JobStatus.DONE
    )
      throw new HttpError(
        HttpErrorCodes.JOB_UPDATE_INVALID_STATUS,
        'Invalid job status provided, please try again.'
      )

    const job = await this.server.db.table<Job>(Tables.Jobs)
      .update({ status })
      .where({ uid })
      .where('status', '<', status)
      .where('rider', rider.uid)
      .returning('*')

    if (job.length < 1)
      throw new HttpError(
        HttpErrorCodes.JOB_UPDATE_FAILED,
        'Job update failed. Either job doesn\'t exist, or invalid status was provided. Please try again.'
      )

    // TODO: Send notification to user who made the job.

    return job[0]
  }
}

export default JobUtils