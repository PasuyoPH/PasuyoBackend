import { V2JobTypes } from './db/Job'

interface V2JobOptions {
  creator: string
  type: V2JobTypes
  points: string[]
  draft?: boolean

  // service specific data
  item?: string
  weight?: string
}

export default V2JobOptions