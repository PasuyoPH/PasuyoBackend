import Schema from '../base/Schema'
import Tables from '../types/Tables'
import { ItemTypes } from '../types/database/MerchantItem'

class MerchantItemSchema extends Schema {
  public static tableName: string = Tables.MerchantItems

  public async handle() {
    this.uid('uid').unique()
    this.uid('merchant').notNullable()
    this.table.text('name').notNullable()
    this.table.double('price').defaultTo(0)
    this.table.text('image')
    this.table.integer('stock').defaultTo(0)
    this.table.integer('type').defaultTo(ItemTypes.OTHER)
    this.table.text('banner')
    this.table.bigint('addedAt').notNullable()
  }
}

export default MerchantItemSchema