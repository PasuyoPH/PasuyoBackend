import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'

class RiderUtils {
  constructor(public server: HttpServer) {}

  // get available jobs
  public async getJobs() {
    return await this.server.db.table(Tables.Jobs)
      .select('*')
  }
}

export default RiderUtils