import { V2JobTypes } from './db/Job'
import { Geo } from './Geo'

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