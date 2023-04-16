import Path from '../../../base/Path'

class V2GetUserJobs extends Path {
  public path = '/v2/user/jobs'
  public requireUserToken = true

  public async onRequest() {
    console.log('a')
    console.log(await this.server.utils.user.getJobs(this.user.uid))

    return {
      value: await this.server.utils.user.getJobs(this.user.uid),
      code: 200
    }
  }
}

export default V2GetUserJobs