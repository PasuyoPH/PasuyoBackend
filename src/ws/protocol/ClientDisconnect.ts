import HttpServer from '../../base/HttpServer'
import { WsClientDisconnectProtocol } from '../../types/v2/ws/Protocol'

class WsClientDisconnect {
  constructor(public server: HttpServer) {}

  public async handle(packet: WsClientDisconnectProtocol) {
    //await this.server.log('Received DISCONNECT protocol:', packet)
    this.server.utils.ws.gps.delete(packet.d?.uid)
  }
}

export default WsClientDisconnect