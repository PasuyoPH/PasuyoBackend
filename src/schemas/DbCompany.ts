import { Schema } from 'mongoose'
import IDbCompany from '../types/db/Company'

import DbMealSchema from './DbMeal'

const DbCompanySchema = new Schema<IDbCompany>(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },

    uid: {
      type: Schema.Types.String,
      required: true
    },

    meals: {
      type: [DbMealSchema],
      required: true
    },

    desc: Schema.Types.String
  },
  { versionKey: false }
)

export default DbCompanySchema