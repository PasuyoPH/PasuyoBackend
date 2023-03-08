import HttpServer from '../../base/HttpServer'
import { WsGeoUpdateProtocol } from '../../types/v2/ws/Protocol'

class WsGeoUpdate {
  constructor(public server: HttpServer) {}

  public async handle(packet: WsGeoUpdateProtocol) {
    if (!packet.d) return

    const user = this.server.utils.ws.gps.get(packet.d.uid) ?? { latitude: 0, longitutde: 0 }
    
    user.latitude = packet.d.latitude
    user.longitutde = packet.d.longitude

    this.server.utils.ws.gps.set(packet.d.uid, user)
  }
}

export default WsGeoUpdate