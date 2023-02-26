import { IJobTypes } from '../db/Job'

interface INewJob {
  type: IJobTypes
  data: any
}

export default INewJob