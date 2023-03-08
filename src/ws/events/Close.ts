import WebSocket from 'ws'
import HttpServer from '../../base/HttpServer'

class CloseEvent {
  constructor(public server: HttpServer) {}

  public async handle() {
    //await this.server.log('Disconnected from WebSocket server. Will attempt to reconnect')
    //delete this.server.ws

    //await this.server.setupWebsocket()
  }
}

export default CloseEvent