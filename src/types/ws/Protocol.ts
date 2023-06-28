import { RiderStates } from '../database/Rider'
import User from '../database/User'

interface Geo {
  latitude: number
  longitude: number
}

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
  BACKEND_RIDER_UPDATE_STATE,
  BACKEND_RIDER_UPDATE_GEO,
  APP_UPDATE_USER_DATA,
  DE_INIT_RIDER
}

interface WsSendAppUpdateUserDataProtocol {
  c: ProtocolSendTypes.APP_UPDATE_USER_DATA
  d: User
}

interface WsSendBackendRiderUpdateGeo {
  c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_GEO
  d: { uid: string, geo: Geo }
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
  }
}

interface WsSendBackendRiderUpdateState {
  c: ProtocolSendTypes.BACKEND_RIDER_UPDATE_STATE
  d: { uid: string, state: RiderStates }
}

type WsSendProtocol =
  WsSendInitBackendProtocol |
  WsSendJobToRidersProtocol |
  WsSendBackendRiderUpdateState |
  WsSendBackendRiderUpdateGeo |
  WsSendAppUpdateUserDataProtocol

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

  WsAcceptJobProtocol,
  WsSendBackendRiderUpdateGeo,
  WsSendAppUpdateUserDataProtocol
}