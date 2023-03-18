import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2FinalizeJob extends Path {
  public path = '/v2/jobs/finalize/:uid'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid }: { uid: string } = req.params as any

    return {
      value: await this.server.utils.user.finalizeJob(this.user.uid, uid),
      code: 200
    }
  }
}

export default V2FinalizeJob