import HttpServer from '../../base/HttpServer'
import { ProtocolSendTypes } from '../../types/ws/Protocol'

class OpenEvent {
  constructor(public server: HttpServer) {}

  public async handle() {
    await this.server.log('WebSocket connection successfully open.')
    this.server.utils.ws.hash = this.server.utils.ws.createHash()

    await this.server.log('Computed hash for backend initiation:', this.server.utils.ws.hash)
    await this.server.utils.ws.send(
      {
        c: ProtocolSendTypes.INIT_BACKEND,
        d: { hash: this.server.utils.ws.hash }
      }
    )
  }
}

export default OpenEvent