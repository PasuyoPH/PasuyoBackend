import { Schema } from 'mongoose'
import {
  IDbOrder,
  IMealAsOrder
} from '../types/db/Order'
import DbMealSchema from './DbMeal'

const MealAsOrderSchema = new Schema<IMealAsOrder>(
    {
      ...DbMealSchema.obj,

      quantity: {
        type: Schema.Types.Number,
        required: true
      }
    },
    {
      versionKey: false,
      _id: false
    }
  ),
  DbOrderSchema = new Schema<IDbOrder>(
    {
      uid: {
        type: Schema.Types.String,
        required: true 
      },

      meals: [MealAsOrderSchema],

      address: {
        type: Schema.Types.String,
        required: true 
      },

      status: {
        type: Schema.Types.Number,
        required: true 
      }
    },
    { versionKey: false }
  )

export default DbOrderSchema