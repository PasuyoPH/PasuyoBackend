// PaDeliver system
import { Schema } from 'mongoose'
import {
  IDbDelivery,
  IDbDeliveryInfo
} from '../types/db/Delivery'

const DbDeliveryInfoSchema = new Schema<IDbDeliveryInfo>(
    {
      name: {
        type: Schema.Types.String,
        required: true 
      },

      contact: {
        type: Schema.Types.String,
        required: true 
      },

      address: {
        type: Schema.Types.String,
        required: true 
      },

      landmark: Schema.Types.String 
    },
    {
      _id: false,
      versionKey: false
    }
  ),
  DbDeliverySchema = new Schema<IDbDelivery>(
    {
      from: {
        type: DbDeliveryInfoSchema,
        required: true
      },

      to: {
        type: DbDeliveryInfoSchema,
        required: true 
      },

      item: {
        type: Schema.Types.String,
        required: true
      },

      uid: {
        type: Schema.Types.String,
        required: true
      },
      
      status: {
        type: Schema.Types.Number,
        required: true
      }
    },
    {
      _id: false,
      versionKey: false
    }
  )

export {
  DbDeliveryInfoSchema,
  DbDeliverySchema
}