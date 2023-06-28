import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import PathPermissions from '../../types/path/PathPermissions'

// Fetches jobs available to view, and the current rider job
// This requires latitude & longitude input
class ViewJobs extends Path {
  public path = '/jobs'
  public permissions: PathPermissions = {
    check: 'rider',
    verified: true
  }

  public async onRequest(req: ClientRequest) {
    const latitude = Number(req.params('latitude')),
      longitude = Number(req.params('longitude'))

    return {
      value: await this.server.utils.jobs.getAvailableJobs(
        latitude,
        longitude,
        this.rider
      ),
      code: 200
    }
  }
}

export default ViewJobs