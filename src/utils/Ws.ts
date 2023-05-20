import { randomBytes } from 'crypto'
import HttpServer from '../base/HttpServer'

import { WsSendProtocol } from '../types/v2/ws/Protocol'
import WebSocket from 'ws'

//import WsGeoUpdate from '../ws/protocol/GeoUpdate'
import WsClientDisconnect from '../ws/protocol/ClientDisconnect'
import WsAcceptJob from '../ws/protocol/AcceptJob'
import WsClientInitiated from '../ws/protocol/ClientInitiated'

class WsUtils {
  public hash: string
  public protocols: {
    //geoUpdate: WsGeoUpdate
    clientDisconnect: WsClientDisconnect
    acceptJob: WsAcceptJob
    clientInitiated: WsClientInitiated
  }

  public gps: Map<
    string,
    { longitutde: number, latitude: number }
  > = new Map()

  constructor(public server: HttpServer) {
    this.protocols = {
      //geoUpdate: new WsGeoUpdate(this.server),
      clientDisconnect: new WsClientDisconnect(this.server),
      acceptJob: new WsAcceptJob(this.server),
      clientInitiated: new WsClientInitiated(this.server)
    }
  }

  public send(data: WsSendProtocol): Promise<Error | WsSendProtocol> {
    return new Promise(
      (resolve, reject) => {
        if (!this.server.config.ws.enabled) return resolve(null)

        if (!this.server.ws) return reject(
          new Error('Tried sending data while no websocket connection was created.')
        )

        const content = JSON.stringify(data)
        if (this.server.ws.readyState === WebSocket.OPEN)
          this.server.ws.send(
            content,
            (err) => err ? reject(err) : resolve(undefined)
          )
        else resolve(data)
      }
    )
  }

  public createHash() {
    let innerBufferOffset = 0

    const bytes = 16,
      rand = randomBytes(bytes),
      end = Math.floor(Math.random() * 2),
      buffer = Buffer.allocUnsafe(this.server.config.ws.name.length + rand.length + 1),
      offset = (end ? rand.length : 0) + 1

    buffer.writeUint8(end, innerBufferOffset++)
    
    if (end) {
      rand.copy(buffer, innerBufferOffset)
      innerBufferOffset += rand.length
      
      buffer.fill(
        0,
        innerBufferOffset,
        innerBufferOffset += this.server.config.ws.name.length
      )
    } else {
      buffer.fill(
        0,
        innerBufferOffset,
        innerBufferOffset += this.server.config.ws.name.length
      )
      rand.copy(buffer, innerBufferOffset)
    }

    for (let i = 0; i < this.server.config.ws.name.length; i++)
      buffer.writeUInt8(
        this.server.config.ws.name.charCodeAt(i) + this.server.config.ws.name.length,
        offset + i
      )

    return buffer.toString('hex')

    /*const createHash = () => {
      let innerBufferOffset = 0 // used for making the buffer
      
      const rand = crypto.randomBytes(bytes),
        end = Math.floor(Math.random() * 2),
        buffer = Buffer.concat(
          [
            Buffer.from([ end ]),
            ...(
              end ? (
                [
                  rand,
                  Buffer.alloc(appName.length)
                ]
              ) : (
                [
                  Buffer.alloc(appName.length),
                  rand
                ]
              )
            )
          ]
        ),
        offset = (end ? rand.length : 0) + 1
    
      for (let i = 0; i < appName.length; i++)
        buffer.writeUInt8(appName.charCodeAt(i) + appName.length, offset + i)
    
      return buffer
    }*/
  }
}

export default WsUtils