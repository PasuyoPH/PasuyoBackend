import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import { V2Job, V2JobStatus } from '../types/v2/db/Job'
import { V2Rider } from '../types/v2/db/User'
import V2HttpErrorCodes from '../types/v2/http/Codes'

class RiderUtils {
  constructor(public server: HttpServer) {}

  public async getAddressesById(ids: string[]) {
    return await this.server.db.table(Tables.v2.Address)
      .select('*')
      .whereIn('uid', ids)
  }

  public async acceptJob(rider: V2Rider, uid: string) {
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
        'Rider already has an existing job'
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

    job.rider = rider.uid // update this job's rider
    rider.credits -= job.fee

    // update rider
    await this.server.db.table(Tables.v2.Riders)
      .update(rider)

    await this.server.db.table(Tables.v2.Jobs)
      .update(job)

    return job
  }

  // get available jobs
  public async getJobs(rider: string) {
    const jobs = (
      await this.server.db.table(Tables.v2.Jobs)
        .select('*')
        .whereNot('status', V2JobStatus.CANCELLED)
        .whereNot('status', V2JobStatus.DONE)
      ) as V2Job[],
      filtered = jobs.reduce( // filter jobs
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

    return filtered
  }
}

export default RiderUtils