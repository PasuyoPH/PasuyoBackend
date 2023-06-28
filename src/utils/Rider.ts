import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import Job, { JobStatus } from '../types/database/Job'
import { Rider } from '../types/database/Rider'

class RiderUtils {
  constructor(public server: HttpServer) {}

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
    return await this.server.db.table<Job>(Tables.Jobs)
      .select('*')
      .where({ rider: uid })
      .whereNotIn(
        'status',
        [JobStatus.CANCELLED, JobStatus.DONE]
      )
      .first()
  }
}

export default RiderUtils