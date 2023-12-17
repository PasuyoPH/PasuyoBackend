import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Delivery from '../types/database/Delivery'
import Job, { JobStatus } from '../types/database/Job'
import Job2 from '../types/database/Job2'
import Order from '../types/database/Order'
import { Rider } from '../types/database/Rider'

class RiderUtils {
  constructor(public server: HttpServer) {}

  public async getOtherRider(uid: string) {
    return await this.server.db.table<Rider>(Tables.Riders)
      .select('uid', 'fullName', 'phone', 'email')
      .where('uid', uid)
      .first()
  }

  public async requestLoad(uid: string, file: Buffer) {
    const fileUrl = await this.server.utils.uploadFile(
      {
        storage: 'load',
        file
      }
    )
  }

  public async getRiderStats(uid: string) {
    const { count: rides } = await this.server.db.table<Job2>(Tables.Jobs2)
      .where('rider', uid)
      .count()
      .first()

    // get delivery hours
    const { sum: deliverySecs } = await this.server.db.table<Delivery>(Tables.Deliveries)
      .where('rider', uid)
      .count()
      .sum('eta')
      .first(),
      { sum: orderSecs } = await this.server.db.table<Order>(Tables.Orders)
        .where('rider', uid)
        .count()
        .sum('eta')
        .first()

    return {
      rides,
      hours: (deliverySecs + orderSecs) / 3600
    }
  }

  public async optIn(uid: string, status: boolean) {
    const result = (
      await this.server.db.table<Rider>(Tables.Riders)
        .update({ optInLocation: status })
        .where({ uid })
        .returning('*')
    )[0]

    await this.server.utils.ws.updateUserToWs(result)
    return result
  }

  /**
   * Get the history of the riders.
   * @param uid The id of the rider to filter with.
   */
  public async getRiderHistory(uid: string) {
    const today = new Date(),
      year = today.getFullYear(),
      month = today.getMonth(),
      day = today.getDate(),
      startOfToday = new Date(year, month, day)
        .getTime(),
      endOfToday = new Date(year, month, day + 1)
        .getTime(),
      jobs = await this.server.db.table<Job>(Tables.Jobs)
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
            status: JobStatus.DONE
          }
        )
        .whereBetween(
          'finishedAt',
          [startOfToday, endOfToday]
        )

    return jobs
  }

  // (UNUSED)
  /**
   * Get all active jobs of a specific rider.
   * @param uid The id of the rider to filter with.
   */
  public async getRiderJobs(uid: string) {
    const jobs = (
      await this.server.db.table<Job>(Tables.Jobs)
        .select('*')
        .where('draft', false)
        .where(
          function() {
            this.where({ status: JobStatus.PROCESSED })
              .orWhere('rider', uid)
              .whereNotIn(
                'status',
                [JobStatus.CANCELLED, JobStatus.DONE]
              )
          }
        )
    ) as Job[]

    return jobs
  }

  /**
   * Fetches the current job of a rider
   * @param uid The id of the rider
   */
  public async getCurrentJob(uid: string) {
    const job = await this.server.db.table<Job2>(Tables.Jobs2)
      .select('*')
      .where(
        {
          rider: uid,
          finished: false
        }
      )
      .first()
      
    if (!job)
      throw new HttpError(
        HttpErrorCodes.JOB2_RIDER_NO_JOB,
        'Rider does not have a job.'
      )

    return await this.server.utils.jobs2.getData(job.dataUid, job.type)
  }
}

export default RiderUtils