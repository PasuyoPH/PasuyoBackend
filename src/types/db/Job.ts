enum IJobTypes {
  PADELIVER,
  PAORDER
}

enum IJobStatus {
  // General Types
  PROCESSED,

  // Delivery Types
  DELIVERY_PICKED_UP,
  DELIVERY_DONE,

  // Other statuses
  CANCELLED = -1,
}

interface IJob {
  uid: string // job id
  creator: string // customer

  rider: string // rider id who took the order
  type: IJobTypes // job type

  data: Buffer // job data, for different types
  status: IJobStatus // job status
}

export {
  IJobTypes,
  IJobStatus,

  IJob
}