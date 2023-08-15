import Schema from '../base/Schema'
import Tables from '../types/Tables'

class MerchantSchema extends Schema {
  public static tableName: string = Tables.Merchant

  public async handle() {
    this.uid('uid').unique()
    this.table.bigint('createdAt').notNullable()
    this.table.text('banner')
    this.table.text('logo')
    this.table.text('name').notNullable()
    this.table.text('bio')
    this.table.integer('sales').defaultTo(0)
    this.table.specificType('tags', 'text ARRAY').defaultTo([])
    this.table.tinyint('priceLevels').defaultTo(0)
    this.table.text('accent')
  }
}

export default MerchantSchema