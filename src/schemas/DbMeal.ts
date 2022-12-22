import { Schema } from 'mongoose'
import IDbMeal from '../types/db/Meal'

const DbMealSchema = new Schema<IDbMeal>(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },

    price: {
      type: Schema.Types.Number,
      required: true
    },

    uid: {
      type: Schema.Types.String,
      required: true
    },

    desc: Schema.Types.String
  },
  {
    _id: false,
    versionKey: false
  }
)

export default DbMealSchema