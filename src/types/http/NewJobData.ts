import { JobTypes } from '../database/Job'

interface NewJobData {
  type: JobTypes
  points: string[] // uid of addresses
  draft?: boolean

  // job specific data

  // delivery
  item?: string
  weight?: string
}

export default NewJobData