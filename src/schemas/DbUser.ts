import { Schema } from 'mongoose'
import { IDbUser } from '../types/db/Users'

import { DbDeliverySchema } from './DbDelivery'
import DbOrderSchema from './DbOrder'

const DbUserSchema = new Schema<IDbUser>(
  {
    uid: {
      type: Schema.Types.String,
      unique: true,
      required: true
    },

    email: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      required: true
    },

    pin: {
      type: Schema.Types.Number,
      required: true
    },

    role: {
      type: Schema.Types.Number,
      required: true
    },

    orders: {
      type: [DbOrderSchema],
      required: true
    },

    deliveries: {
      type: [DbDeliverySchema],
      required: true
    },

    jobs: [],

    phone: Schema.Types.Number
  },
  { versionKey: false }
)

export default DbUserSchema