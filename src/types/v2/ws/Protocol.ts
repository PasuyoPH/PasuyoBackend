import { Geo } from '../Geo'

enum ProtocolTypes {
  ERROR,
  GET_ALL_LOCATIONS, // unused
  GEO_UPDATE,
  CLIENT_DISCONNECTED
}

interface WsErrorProtocol {
  c: ProtocolTypes.ERROR,
  d: {
    code: number
    msg: string
  }
}

interface WsGeoUpdateProtocol {
  c: ProtocolTypes.GEO_UPDATE
  d: {
    longitude: number
    latitude: number

    uid: string
  }
}

interface WsClientDisconnectProtocol {
  c: ProtocolTypes.CLIENT_DISCONNECTED
  d: { uid: string }
}

type WsProtocol = WsErrorProtocol | WsGeoUpdateProtocol | WsClientDisconnectProtocol

// Send Protocol
enum ProtocolSendTypes {
  INIT_RIDER,
  INIT_BACKEND,

  JOB_NEW,

  JOB_ACCEPT,
  JOB_DENY,

  GET_ALL_AVAILABLE_RIDERS
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

interface WsSendRequestAvailableRidersProtocol {
  c: ProtocolSendTypes.GET_ALL_AVAILABLE_RIDERS
  d: null
}

type WsSendProtocol =
  WsSendInitBackendProtocol |
  WsSendJobToRidersProtocol |
  WsSendRequestAvailableRidersProtocol

export {
  ProtocolTypes,
  WsErrorProtocol,

  WsGeoUpdateProtocol,
  WsClientDisconnectProtocol,

  WsProtocol,

  ProtocolSendTypes,
  WsSendInitBackendProtocol,

  WsSendProtocol,
  WsSendJobToRidersProtocol,

  WsSendRequestAvailableRidersProtocol
}