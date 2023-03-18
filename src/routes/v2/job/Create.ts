import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'
import V2HttpJob from '../../../types/v2/http/Job'

class V2CreateJobPreview extends Path {
  public path   = '/v2/jobs'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const data = req.body as unknown as V2HttpJob
    
    return {
      value: await this.server.utils.createJobV2(
        {
          ...data,
          creator: this.user.uid
        }
      ),
      code: 200
    }
  }
}

export default V2CreateJobPreview