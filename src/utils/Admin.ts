import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import LoadRequest from '../types/database/LoadRequest'
import { Rider } from '../types/database/Rider'
import { ProtocolSendTypes } from '../types/ws/Protocol'

class AdminUtils {
  constructor(public server: HttpServer) {}

  public async approveLoad(uid: string) {
    return await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .delete()
      .where({ uid })
  }

  public async updateRiderDataToWebSocket(rider: Rider) {
    return await this.server.utils.ws.send(
      {
        c: ProtocolSendTypes.APP_UPDATE_USER_DATA,
        d: rider
      }
    )
  }

  public async setRiderCredits(uid: string, amount: number) {
    if (!isNaN(amount)) amount = 0.00 // should throw error instead
    const rider = (
      await this.server.db.table<Rider>(Tables.Riders)
        .where('uid', uid)
        .increment('credits', amount)
        .returning('*')
    )[0]

    await this.updateRiderDataToWebSocket(rider)
    return rider
  }

  public async verifyRider(uid: string) {
    const rider = (
      await this.server.db.table<Rider>(Tables.Riders)
        .where('uid', uid)
        .update('verified', true)
        .returning('*')
    )[0]

    await this.updateRiderDataToWebSocket(rider)
    return rider
  }

  // returns limited info on riders
  public async getRiders() {
    return await this.server.db.table<Rider>(Tables.Riders)
      .select(
        'uid',
        'verified',
        'credits',
        'fullName',
        'phone',
        'email'
      )
  }
}

export default AdminUtils