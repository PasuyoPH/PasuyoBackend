enum V2JobTypes {
  PADELIVER,
  PAUTOS
}

enum V2JobStatus {
  PROCESSED,
  DELIVER_PICKED_UP,
  DONE,
  CANCELLED = -1
}

interface V2Job {
  uid: string
  creator: string
  rider?: string
  type: V2JobTypes
  status: V2JobStatus
  
  // location related
  startPoint: Buffer
  midPoints?: Buffer
  finalPoint: Buffer

  // time of delivery
  startedAt?: number
  finishedAt?: number

  other?: string // this data could be anything
  draft?: boolean

  distance: number
  fee: number
  eta: number

  // service specific data

  // delivery
  item?: string
  weight?: number
}

export {
  V2JobTypes,
  V2JobStatus,

  V2Job
}