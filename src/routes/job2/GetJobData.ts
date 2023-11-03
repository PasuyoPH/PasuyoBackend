import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'

class GetJobData extends Path {
  public method = 'get'
  public path = '/jobs2/:uid/data'

  public async onRequest(req: ClientRequest) {
    const uid = req.params('uid'),
      type = Number(req.query('type') ?? '0')

    return {
      value: await this.server.utils.jobs2.getData(uid, isNaN(type) ? 0 : type),
      code: 200
    }
  }
}

export default GetJobData