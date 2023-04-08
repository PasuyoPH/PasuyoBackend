import Path from '../../../base/Path'
import { HttpReq } from '../../../types/Http'

// this gets the all jobs, but with minimal data
class V2ViewJobs extends Path {
  public path = '/v2/rider/jobs/view'
  public requireUserToken = true
  public mustBeVerifiedRider = true

  public async onRequest(req: HttpReq) {   
    const {
      latitude,
      longitude,
      extra
    } = req.query as {
      latitude: string
      longitude: string
      extra: string
    }
    
    return {
      value: await this.server.utils.rider.viewJobs(
        this.user.uid,
        isNaN(latitude as any) ? 0 : Number(latitude),
        isNaN(longitude as any) ? 0 : Number(longitude),
        extra === 'true'
      ),
      code: 200
    }
  }
}

export default V2ViewJobs