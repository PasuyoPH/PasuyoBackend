import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import { V2Job, V2JobStatus } from '../types/v2/db/Job'
import { V2Rider, V2RiderStates } from '../types/v2/db/User'
import V2HttpErrorCodes from '../types/v2/http/Codes'

class RiderUtils {
  constructor(public server: HttpServer) {}

  public async updateJobStatus(
    rider: string,
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
      .first()

    if (!job)
      throw new HttpError(
        V2HttpErrorCodes.JOB_UPDATE_FAILED,
        'Job update failed. Either job doesn\'t exist, or invalid status was provided. Please try again.'
      )
    
    return job
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
    if (!file)
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
        await trx.table<V2Job>(Tables.v2.Jobs)
          .update(
            {
              status: V2JobStatus.DONE,
              finishedAt: Date.now(),
              proof: fileUrl
            }
          )
          .where({ uid })

        const result = await trx.table<V2Rider>(Tables.v2.Riders)
          .update({ state: V2RiderStates.RIDER_ONLINE })
          .where({ uid: rider })

        if (result > 0) // update to websocket
          await this.server.utils.updateRiderState(rider, V2RiderStates.RIDER_ONLINE, true)
      }
    )
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
    
        const updatedRider = await trx.table(Tables.v2.Riders)
          .where(
            {
              uid: (rider as V2Rider).uid,
              state: V2RiderStates.RIDER_ONLINE
            }
          )
          .where('credits', '>=', job.fee)
          .update(
            {
              credits: (rider as V2Rider).credits - job.fee,
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
    
        await trx.table(Tables.v2.Jobs)
          .where({ uid: job.uid })
          .update(
            {
              rider: (rider as V2Rider).uid,
              status: V2JobStatus.ACCEPTED,
              startedAt: Date.now(),
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