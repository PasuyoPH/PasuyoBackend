import WebSocket from 'ws'
import HttpServer from '../../base/HttpServer'

import { ProtocolTypes, WsProtocol } from '../../types/v2/ws/Protocol'

class MessageEvent {
  constructor(public server: HttpServer) {}

  public async handle(data: WebSocket.RawData) {
    const string = data.toString()

    try {
      const packet = JSON.parse(string) as WsProtocol

      switch (packet.c) {
        /*case ProtocolTypes.GEO_UPDATE:
          this.server.utils.ws.protocols.geoUpdate.handle(packet)
          break*/

        case ProtocolTypes.CLIENT_DISCONNECTED:
          await this.server.utils.ws.protocols.clientDisconnect.handle(packet)
          break

        case ProtocolTypes.ACCEPT_JOB: // protocol to accept job
          await this.server.utils.ws.protocols.acceptJob.handle(packet)
          break

        case ProtocolTypes.CLIENT_INITIATED:
          await this.server.utils.ws.protocols.clientInitiated.handle(packet)
          break

        default:
          await this.server.log('Unhandled packet:', packet)
          break
      }
    } catch {}
  }
}

export default MessageEvent