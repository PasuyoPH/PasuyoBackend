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
  INIT,
  SET_GEO,
  INIT_BACKEND,
  GET_ALL_LOCATIONS,
  SEND_JOB_TO_RIDERS
}

interface WsSendInitBackendProtocol {
  c: ProtocolSendTypes.INIT_BACKEND
  d: { hash: string }
}

interface WsSendJobToRidersProtocol {
  c: ProtocolSendTypes.SEND_JOB_TO_RIDERS
  d: { uid: string }
}

type WsSendProtocol = WsSendInitBackendProtocol | WsSendJobToRidersProtocol

export {
  ProtocolTypes,
  WsErrorProtocol,

  WsGeoUpdateProtocol,
  WsClientDisconnectProtocol,

  WsProtocol,

  ProtocolSendTypes,
  WsSendInitBackendProtocol,

  WsSendProtocol,
  WsSendJobToRidersProtocol
}