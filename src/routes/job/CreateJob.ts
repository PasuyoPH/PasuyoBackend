import Path from '../../base/Path'
import INewJob from '../../types/data/NewJob'

import { HttpReq, IRoute } from '../../types/Http'

// for customers only
class CreateJob extends Path implements IRoute {
  public path   = '/job'
  public method = 'post'

  public requireUserToken = true

  public async onRequest(req: HttpReq) {
    const { type, data } = req.body as unknown as INewJob
    
    return {
      value: await this.server.utils.createJob(
        {
          creator: this.user.uid,
          type,

          data
        }
      ),
      code: 200
    }
  }
}

export default CreateJob