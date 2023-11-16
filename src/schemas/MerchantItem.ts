import Schema from '../base/Schema'
import Tables from '../types/Tables'

class MerchantItemSchema extends Schema {
  public static tableName: string = Tables.MerchantItems

  public async handle() {
    // default data
    this.uid('uid').unique()
    this.uid('merchant')
    this.table.bigint('addedAt').notNullable()

    // customizable data

    this.table.text('name').notNullable()
    this.table.double('price').defaultTo(0)
    this.table.text('image')
    this.table.integer('stock').defaultTo(0)
    this.table.text('banner')
    this.table.tinyint('eta') // time to prepare
    this.table.boolean('available').defaultTo(false)
  }
}

export default MerchantItemSchema