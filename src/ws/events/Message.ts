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
        case ProtocolTypes.GEO_UPDATE:
          this.server.utils.ws.protocols.geoUpdate.handle(packet)
          break

        case ProtocolTypes.CLIENT_DISCONNECTED:
          this.server.utils.ws.protocols.clientDisconnect.handle(packet)
          break

        default:
          console.log(packet)
          break
      }
    } catch {}
  }
}

export default MessageEvent