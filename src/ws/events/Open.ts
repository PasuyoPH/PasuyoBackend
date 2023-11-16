import HttpServer from '../../base/HttpServer'
import * as ProtocolTypes from '../../types/protocol/types'

class OpenEvent {
    constructor(public server: HttpServer) {}

  public async handle() {
    await this.server.log('WebSocket connection successfully open.')
    this.server.utils.ws.hash = this.server.utils.ws.createHash()

    await this.server.log('Computed hash for backend initiation:', this.server.utils.ws.hash)
    await this.server.utils.ws.send(
      {
        c: ProtocolTypes.in.IDENTIFY,
        d: {
          token: this.server.utils.ws.hash,
          type: 0
        }
      }
    )
  }
}

export default OpenEvent