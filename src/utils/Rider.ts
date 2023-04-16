import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import V2Address from '../types/v2/db/Address'
import { V2Job, V2JobMini, V2JobMiniExtra, V2JobStatus, V2JobStatusAsText } from '../types/v2/db/Job'
import V2LoadRequest from '../types/v2/db/LoadRequest'
import { V2Rider, V2RiderStates } from '../types/v2/db/User'
import { Geo } from '../types/v2/Geo'
import V2HttpErrorCodes from '../types/v2/http/Codes'
import { DEFAULT_INCOME_RATE, IncomeRates } from '../types/v2/Rates'
import { ProtocolSendTypes } from '../types/v2/ws/Protocol'

class RiderUtils {
  constructor(public server: HttpServer) {}

  public async uploadRiderID(file: Buffer, uid: string) {
    // upload to storage
    const fileUrl = await this.server.utils.uploadFile(
      {
        path: '/ids',
        storage: 'profiles',
        file
      }
    )

    // update rider db
    const result = (
      await this.server.db.table<V2Rider>(Tables.v2.Riders)
        .update({ id: fileUrl })
        .where({ uid })
        .returning('*')
    )[0]

    if (result)
      await this.server.utils.user.updateUserToWs(result)

    return result
  }

  public async requestLoad(file: Buffer, rider: string) {
    // upload to storage
    const proof = await this.server.utils.uploadFile(
      {
        storage: 'load',
        file
      }
    )

    // save to db
    const uid = await this.server.utils.genUID()
    return await this.server.db.table<V2LoadRequest>(Tables.v2.LoadRequests)
      .insert(
        {
          uid,
          rider,
          proof
        }
      )
  }

  public async setOptIn(uid: string, status: boolean) {
    const result = (
      await this.server.db.table<V2Rider>(Tables.v2.Riders)
        .update({ optInLocation: status })
        .where({ uid })
        .returning('*')
    )[0]

    await this.server.utils.user.updateUserToWs(result)
    return result
  }

  public async calculateRiderFee(uid: string, rider: V2Rider) {
    const job = await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .select('fee')
      .where({ uid })
      .first(),
      rate = await this.getRiderRate(rider)

    return (job?.fee ?? 0) * rate
  }

  public async getRiderRate(rider: V2Rider) {
    return IncomeRates[rider.rank ?? 0] ?? DEFAULT_INCOME_RATE
  }

  public async getJobAddresses(uid: string) {
    const job = await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .select(
        'startPoint',
        'midPoints',
        'finalPoint'
      )
      .where({ uid })
      .first()

    if (!job) return []
    const ids = await this.server.utils.jobLocationToIDs(
      Buffer.concat(
        [
          Buffer.from(job.startPoint),
          Buffer.from(job.midPoints ?? []),
          Buffer.from(job.finalPoint)
        ]
      )
    )

    const result = await this.server.db.table<V2Address>(Tables.v2.Address)
      .select(
        'uid',
        'formattedAddress',
        'house',
        'name'
      )
      .whereIn('uid', ids)

    return ids.map(
      (id) => result.find(
        (address) => address.uid === id
      )
    )
  }

  public async viewJobs(
    rider: string,
    latitude: number,
    longitude: number,
    includeExtra?: boolean
  ) {
    const selectedFields = await this.server.utils.getJobSelectedFields(includeExtra)

    // queries
    const nearestJobsQuery = this.server.db.table<V2JobMini | V2JobMiniExtra>(Tables.v2.Jobs)
      .select(selectedFields)
      .where(
        {
          status: V2JobStatus.PROCESSED,
          draft: false
        }
      )
      .orderByRaw(
        `ST_DistanceSphere(
          ST_MakePoint("startX", "startY"),
          ST_MakePoint(:longitude, :latitude)
        ) ASC`,
        {
          latitude,
          longitude
        }
      )
      .limit(5), // first 5 only
      jobsByDateQuery = this.server.db.table<V2JobMini | V2JobMiniExtra>(Tables.v2.Jobs)
        .select(selectedFields)
        .where(
          (firstBuilder) => firstBuilder.where(
              {
                status: V2JobStatus.PROCESSED,
                draft: false
              }
            )
            .orWhere(
              (secondBuilder) => secondBuilder.where({ rider })
                .whereNotIn(
                  'status',
                  [
                    V2JobStatus.PROCESSED,
                    V2JobStatus.DONE
                  ]
                )
            )
        )
        .orderBy('createdAt', 'desc')

    const [available, nearest] = await Promise.all(
      [jobsByDateQuery, nearestJobsQuery]
    )

    return { available, nearest }
  }
  
  public async updateRiderGeo(
    rider: string,
    geo: Geo
  ) {
    if (
      typeof geo?.latitude !== 'number' ||
      typeof geo?.longitude !== 'number'
    )
      throw new HttpError(
        V2HttpErrorCodes.RIDER_UPDATE_GEO_INVALID,
        'Invalid geo location provided.'
      )

    // send to websocket
    return await this.server.utils.ws.send(
      {
        c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_GEO,
        d: { uid: rider, geo }
      }
    )
  }

  public async updateJobStatus(
    rider: V2Rider,
    uid: string,
    status: V2JobStatus
  ) {
    const least = V2JobStatus.CANCELLED,
      highest = V2JobStatus.DONE

    if (
      typeof status !== 'number' ||
      status <= least ||
      status >= highest
    )
      throw new HttpError(
        V2HttpErrorCodes.JOB_UPDATE_INVALID_STATUS,
        'Invalid job status was provided. Please try again.'
      )

    const job = await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .update({ status })
      .where({ uid })
      .where('status', '<', status)
      .returning('*')

    if (!job[0])
      throw new HttpError(
        V2HttpErrorCodes.JOB_UPDATE_FAILED,
        'Job update failed. Either job doesn\'t exist, or invalid status was provided. Please try again.'
      )

    const tokens = await this.server.db.table(Tables.v2.UserTokens)
      .select('*')
      .where({ user: job[0].creator })

    if (tokens.length >= 1) {
      const jobInfoAsText = await this.server.utils.jobInfoToText(job[0])

      await this.server.expo.sendPushNotificationsAsync(
        tokens.map(
          (token) => (
            {
              to: token.token,
              channelId: 'default',
              title: 'Job Updated',
              body: `${rider.fullName} changed your ${jobInfoAsText.name} of ${jobInfoAsText.data} status to ${V2JobStatusAsText[job[0].status]}.`
            }
          )
        )
      )
    }
    
    return job[0]
  }

  public async getAddressesById(ids: string[]) {
    return await this.server.db.table(Tables.v2.Address)
      .select('*')
      .whereIn('uid', ids)
  }

  public async setOffline(uid: string) {
    return await this.server.db.table<V2Rider>(Tables.v2.Riders)
      .update('state', V2RiderStates.RIDER_OFFLINE)
      .where({ uid })
  }

  public async setOnline(uid: string) {
    return await this.server.db.table<V2Rider>(Tables.v2.Riders)
      .update('state', V2RiderStates.RIDER_ONLINE)
      .where({ uid })
  }

  public async completeJob(file: Buffer, uid: string, rider: string) {
    if (!Buffer.isBuffer(file))
      throw new HttpError(
        V2HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide a proper image file.'
      )

    const fileHash = await this.server.utils.generateFileHash(file),
      fileName = fileHash + '.jpg',
      storageUrl = this.server.config.s3.storages.evidences.url,
      fileUrl = storageUrl + '/' + fileName

    // upload to s3 storage
    await this.server.storages.evidences.putObject(
      {
        Bucket: 'sin1',
        Key: fileName,
        Body: file
      }
    )

    await this.server.db.transaction(
      async (trx) => {
        const job = await trx.table<V2Job>(Tables.v2.Jobs)
          .update(
            {
              status: V2JobStatus.DONE,
              finishedAt: Date.now(),
              proof: fileUrl
            }
          )
          .where({ uid })
          .returning('*')
          .first(),
          xpAdded = await this.server.utils.calculateXp(job.distance),
          result = await trx.table<V2Rider>(Tables.v2.Riders)
            .update(
              {
                state: V2RiderStates.RIDER_ONLINE ,
                xp: this.server.db.raw('xp + ?', [xpAdded])
              }
            )
            .where({ uid: rider })
            .returning('*')

        console.log('Add Xp:', this.server.utils.calculateXp(job.distance))

        if (result.length > 0) { // update to websocket
          await this.server.utils.updateRiderState(rider, V2RiderStates.RIDER_ONLINE, true)
          await this.server.utils.user.updateUserToWs(result[0])
        }
      }
    )
  }

  public async getJob(uid: string) {
    return await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .select('*')
      .where(
        {
          draft: false, // ignore drafts
          uid
        }
      )
      .first()
  }

  /*public async acceptJob(rider: V2Rider, uid: string) {
    // check if rider already has jobs pending
    const riderHasJob = async () => {
      const jobs = await this.server.db.table<V2Job>(Tables.v2.Jobs)
        .select('*')
        .where({ rider: rider.uid })

      return !!jobs.find(
        (job) => job.status !== V2JobStatus.DONE &&
          job.status !== V2JobStatus.CANCELLED
      )
    }

    if (await riderHasJob())
      throw new HttpError(
        V2HttpErrorCodes.JOB_RIDER_HAS_JOB,
        'You already have an existing job'
      )

    // fetch this job
    const job = await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .select('*')
      .where({ uid })
      .first()

    if (!job)
      throw new HttpError(
        V2HttpErrorCodes.JOB_NOT_EXIST,
        'This job can\'t be accepted. It doesn\'t exist.'
      )

    console.log(rider.credits)

    if (rider.credits < job.fee)
      throw new HttpError(
        V2HttpErrorCodes.JOB_NOT_ENOUGH_CREDITS,
        'You do not have enough credits for this job.'
      )

    if (job.rider)
      throw new HttpError(
        V2HttpErrorCodes.JOB_ALREADY_ACCEPTED,
        'This job seems to be accepted already.' +
          (
            job.rider === rider.uid ?
              'By you apparently.' :
              ''
          )
      )

    rider.credits -= job.fee

    // update rider
    await this.server.db.table(Tables.v2.Riders)
      .update({ credits: rider.credits })
      .where({ uid: rider.uid })

    await this.server.db.table(Tables.v2.Jobs)
      .update(
        {
          rider: rider.uid,
          status: V2JobStatus.ACCEPTED,
          startedAt: Date.now()
        }
      )
      .where({ uid: job.uid })

    return job
  }*/

  public async getHistory(uid: string) {
    const today = new Date(),
      year = today.getFullYear(),
      month = today.getMonth(),
      day = today.getDate(),
      startOfToday = new Date(year, month, day)
        .getTime(),
      endOfToday = new Date(year, month, day + 1)
        .getTime(),
      jobs = await this.server.db.table<V2Job>(Tables.v2.Jobs)
        .select(
          'item',
          'type',
          'status',
          'startedAt',
          'fee',
          'createdAt',
          'riderFee'
        )
        .where(
          {
            rider: uid,
            status: V2JobStatus.DONE,
          }
        )
        .whereBetween('finishedAt', [startOfToday, endOfToday])

    return jobs
  }

  public async acceptJob(rider: V2Rider | string, uid: string) {
    const transaction = await this.server.db.transaction(
      async (trx) => {
        if (typeof rider === 'string')
          rider = await trx.table(Tables.v2.Riders)
            .select('*')
            .where({ uid: rider })
            .first()
    
        const job = await trx.table<V2Job>(Tables.v2.Jobs)
          .select('*')
          .where({ uid })
          .where('status', V2JobStatus.PROCESSED)
          .whereNull('rider')
          .first()
    
        if (!job)
          throw new HttpError(
            V2HttpErrorCodes.JOB_FAILED_TO_ACCEPT,
            'This job can\'t be accepted. It doesn\'t exist, or its status is not PROCESSED, or it already has a rider assigned.'
          )

        if (job.draft)
          throw new HttpError(
            V2HttpErrorCodes.JOB_IS_DRAFT,
            'This job is just a draft, you can\'t accept this.'
          )
    
        const fee = job.fee * await this.getRiderRate(rider as V2Rider),
          updatedRider = await trx.table<V2Rider>(Tables.v2.Riders)
            .where(
              {
                uid: (rider as V2Rider).uid,
                state: V2RiderStates.RIDER_ONLINE
              }
            )
            .where('credits', '>=', fee)
            .update(
              {
                credits: (rider as V2Rider).credits - fee,
                state: V2RiderStates.RIDER_UNAVAILABLE
              }
            )
            .returning('*')
    
        if (!updatedRider[0])
          throw new HttpError(
            V2HttpErrorCodes.JOB_NO_CREDITS_OR_NOT_OFFLINE,
            'You do not have enough credits for this job, or your rider status is not ONLINE.'
          )
        
        // update websocket
        await this.server.utils.updateRiderState(
          (rider as V2Rider).uid,
          V2RiderStates.RIDER_UNAVAILABLE,
          true
        )

        await this.server.utils.user.updateUserToWs(updatedRider[0])
        const tokens = await this.server.db.table(Tables.v2.UserTokens)
          .select('*')
          .where({ user: job.creator })

        if (tokens.length >= 1) {
          const jobInfoAsText = await this.server.utils.jobInfoToText(job)
          console.log('Tokens:', tokens)

          await this.server.expo.sendPushNotificationsAsync(
            tokens.map(
              (token) => (
                {
                  to: token.token,
                  channelId: 'default',
                  title: 'Order Accepted',
                  body: `${(rider as V2Rider).fullName} accepted your ${jobInfoAsText.name} of ${jobInfoAsText.data}`
                }
              )
            )
          )
        }
    
        await trx.table(Tables.v2.Jobs)
          .where({ uid: job.uid })
          .update(
            {
              rider: (rider as V2Rider).uid,
              status: V2JobStatus.ACCEPTED,
              startedAt: Date.now(),
              riderFee: fee
            }
          )
    
        return job
      }
    )
  
    return transaction
  }

  public async getRiderJob(rider: string) {
    return await this.server.db.table<V2Job>(Tables.v2.Jobs)
      .select('*')
      .where({ rider })
      .whereNotIn(
        'status',
        [V2JobStatus.CANCELLED, V2JobStatus.DONE]
      )
      .first()
  }

  /**
   * Get available jobs.
   * Filter & reduce was removed in favour of server-side performance.
   * @param rider Rider UID
   * @returns An array of jobs
   */
  public async getJobs(rider: string) {
    const jobs = (
      await this.server.db.table<V2Job>(Tables.v2.Jobs)
        .select('*')
        .where('draft', false)
        .where(
          function() {
            this.where({ status: V2JobStatus.PROCESSED })
              .orWhere('rider', rider)
              .whereNotIn(
                'status',
                [V2JobStatus.CANCELLED, V2JobStatus.DONE]
              )
          }
        )
      ) as V2Job[]

    return jobs
      /*filtered = jobs.reduce( // filter jobs
        (result, curr) => {
          switch (curr.status) {
            case V2JobStatus.PROCESSED:
              result.approved.push(curr)
              break

            case V2JobStatus.DONE:
              result.finished.push(curr)
              break

            case V2JobStatus.CANCELLED:
              result.cancelled.push(curr)
              break

            default:
              result.inJob.push(curr)
              if (!result.current && curr.rider === rider)
                result.current = curr
              break
          }

          return result
        },
        {
          approved: [],
          finished: [],
          cancelled: [],
          inJob: [],
          current: null
        }
      )

    return filtered*/
  }
}

export default RiderUtils