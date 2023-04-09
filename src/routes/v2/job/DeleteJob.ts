import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

class V2DeleteJob extends Path {
  public method = 'delete'
  public path = '/v2/jobs/:uid'
  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { uid } = req.params as { uid: string },
      { draft } = req.query as { draft: string }

    return {
      value: await this.server.utils.user.deleteJob(
        this.user.uid,
        uid,
        draft === 'true'
      ),
      code: 200
    }
  }
}

export default V2DeleteJob