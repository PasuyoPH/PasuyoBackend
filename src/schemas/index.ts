// Import all schemas here for a much cleaner code result
import { model } from 'mongoose'

import DbUserSchema from './DbUser'
import DbCompanySchema from './DbCompany'

const models = {
  Users: model('Users', DbUserSchema),
  Companies: model('Companies', DbCompanySchema)
}

export default models