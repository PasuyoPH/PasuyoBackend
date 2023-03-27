import Path from '../../../base/Path'

// get current rider job
class V2GetCurrentJob extends Path {
  public path = '/v2/rider/jobs/current'
  public requireUserToken = true

  public async onRequest() {
    const job = await this.server.utils.rider.getRiderJob(this.user.uid)

    return {
      value: job,
      code: 200
    }
  }
}

export default V2GetCurrentJob