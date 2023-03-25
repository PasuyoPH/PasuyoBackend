import HttpServer from '../../base/HttpServer'
import { WsAcceptJobProtocol } from '../../types/v2/ws/Protocol'

class WsAcceptJob {
  constructor(public server: HttpServer) {}

  public async handle(packet: WsAcceptJobProtocol) {
    if (!packet.d) return
    console.log('accept:', packet.d)
    await this.server.utils.rider.acceptJob(packet.d.rider, packet.d.job)
  }
}

export default WsAcceptJob