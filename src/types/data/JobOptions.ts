import { IJobTypes } from '../db/Job'

interface IJobOptions {
  creator: string
  type: IJobTypes
  
  data: any
}

export default IJobOptions