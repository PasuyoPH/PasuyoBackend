import HttpServer from '../../base/HttpServer'
import Tables from '../../types/Tables'
import { V2Rider } from '../../types/v2/db/User'
import { ProtocolSendTypes, WsClientInitiatedProtocol } from '../../types/v2/ws/Protocol'

class WsClientInitiated {
  constructor(public server: HttpServer) {}

  public async handle(packet: WsClientInitiatedProtocol) {
    if (!packet.d) return
    await this.server.utils.updateRiderState

    const rider = await this.server.db.table<V2Rider>(Tables.v2.Riders)
      .select('*')
      .where({ uid: packet.d.uid })
      .first()

    if (!rider) return
    await this.server.utils.ws.send( // send latest state to websocket
      {
        c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_STATE,
        d: {
          state: rider.state,
          uid: rider.uid
        }
      }
    )
  }
}

export default WsClientInitiated