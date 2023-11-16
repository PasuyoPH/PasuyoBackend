import { JobTypes } from './Job'

// Move this to Jobs when code is production ready
interface Job2 {
  uid: string
  rider: string
  user?: string
  type: JobTypes
  dataUid: string // uid of the job data
  createdAt: number

  // flags
  finished?: boolean // just a flag
  pickedUp?: boolean
  cancelled?: boolean
}

export default Job2