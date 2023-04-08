enum V2JobTypes {
  PADELIVER,
  PAUTOS
}

const V2JobStatusAsText = [
    'Pending',
    'Accepted',
    'Picked Up',
    'Done'
  ],
  V2JobTypeAsText = [
    'Delivery',
    'Utos'
  ]

enum V2JobStatus {
  PROCESSED,
  ACCEPTED,
  DELIVER_PICKED_UP,
  DONE,
  CANCELLED = -1
}

interface V2JobMini {
  uid: string
  type: V2JobTypes
  status: V2JobStatus
  createdAt: number
  fee: number
  distance: number
  eta: number
  riderFee?: number // how much to detuct from their credits
  rider?: string
  draft?: boolean

  // service specific data

  // delivery
  item?: string
  weight?: number
}

interface V2JobMiniExtra extends V2JobMini {
  startedAt?: number
  finishedAt?: number
}

interface V2Job {
  uid: string
  creator: string
  rider?: string
  type: V2JobTypes
  status: V2JobStatus
  createdAt: number
  
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
  riderFee?: number

  // service specific data

  // delivery
  item?: string
  weight?: number

  proof?: string // url of proof

  // other data for backend only
  startX: number
  startY: number
}

export {
  V2JobTypes,
  V2JobStatus,

  V2Job,
  V2JobStatusAsText,
  V2JobTypeAsText,
  V2JobMini,
  V2JobMiniExtra
}