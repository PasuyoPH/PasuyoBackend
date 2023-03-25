import V2Token from '../db/Token'
import { V2RiderStates } from '../db/User'
import { Geo } from '../Geo'

enum ProtocolTypes {
  ERROR,
  CLIENT_DISCONNECTED,
  RIDER_NEW_JOB,
  ACCEPT_JOB,
  CLIENT_INITIATED
}

interface WsErrorProtocol {
  c: ProtocolTypes.ERROR,
  d: {
    code: number
    msg: string
  }
}
/*
interface WsGeoUpdateProtocol {
  c: ProtocolTypes.GEO_UPDATE
  d: {
    longitude: number
    latitude: number

    uid: string
 */

interface WsAcceptJobProtocol {
  c: ProtocolTypes.ACCEPT_JOB,
  d: { rider: string, job: string }
}

interface WsClientDisconnectProtocol {
  c: ProtocolTypes.CLIENT_DISCONNECTED
  d: { uid: string }
}

interface WsClientInitiatedProtocol {
  c: ProtocolTypes.CLIENT_INITIATED
  d: { uid: string }
}

type WsProtocol = WsErrorProtocol | WsClientDisconnectProtocol | WsAcceptJobProtocol | WsClientInitiatedProtocol

// Send Protocol
enum ProtocolSendTypes {
  INIT_RIDER,
  INIT_BACKEND,
  JOB_NEW,
  JOB_ACCEPT,
  JOB_DENY,
  RIDER_UPDATE_DATA,
  BACKEND_RIDER_UPDATE_STATE
}

interface WsSendInitBackendProtocol {
  c: ProtocolSendTypes.INIT_BACKEND
  d: { hash: string }
}

interface WsSendJobToRidersProtocol {
  c: ProtocolSendTypes.JOB_NEW
  d: {
    uid: string // job id
    geo: {
      address: string // address id
    } & Geo
    tokens: V2Token[] // list of expo tokens
  }
}

interface WsSendBackendRiderUpdateState {
  c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_STATE
  d: { uid: string, state: V2RiderStates }
}

type WsSendProtocol =
  WsSendInitBackendProtocol |
  WsSendJobToRidersProtocol |
  WsSendBackendRiderUpdateState

export {
  ProtocolTypes,
  WsErrorProtocol,

  //WsGeoUpdateProtocol,
  WsClientDisconnectProtocol,
  WsClientInitiatedProtocol,

  WsProtocol,

  ProtocolSendTypes,
  WsSendInitBackendProtocol,

  WsSendProtocol,
  WsSendJobToRidersProtocol,

  WsAcceptJobProtocol
}