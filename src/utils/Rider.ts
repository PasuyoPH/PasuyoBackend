import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'

import GeoCacheData from '../types/v2/Geo'
import HttpError from '../base/HttpError'

import { IErrorCodes } from '../types/Http'

class RiderUtils {
  constructor(public server: HttpServer) {}

  // get available jobs
  public async getJobs() {
    return await this.server.db.table(Tables.Jobs)
      .select('*')
  }

  public setRiderGeo(data: GeoCacheData) {
    if (!data.uid)
      throw new HttpError(
        IErrorCodes.SET_GEO_INVALID_RIDER_ID,
        'Invalid rider id is provided.'
      )

    if (
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    )
      throw new HttpError(
        IErrorCodes.SET_GEO_INVALID_GEOMETRY,
        'Invalid geometry was provided'
      )

    this.server.geo.set(data.uid, data)
  }
}

export default RiderUtils