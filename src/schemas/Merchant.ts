import Schema from '../base/Schema'
import Tables from '../types/Tables'

class MerchantSchema extends Schema {
  public static tableName: string = Tables.Merchant

  public async handle() {
    //main data
    this.uid('uid').unique()
    this.table.bigint('createdAt')

    // customizable data
    this.table.text('name')
    this.table.text('banner')
    this.table.text('logo')
    this.table.text('bio')
    this.table.specificType('tags', 'text ARRAY').defaultTo('{}')
    this.table.tinyint('priceLevels').defaultTo(0)
    this.table.text('accent')
    this.table.specificType('types', 'integer ARRAY').defaultTo('{}')

    // state data
    this.table.boolean('open').defaultTo(false)
    this.table.boolean('hide').defaultTo(false)

    this.table.tinyint('openAt').defaultTo(0)
    this.table.tinyint('closedAt').defaultTo(0)
  }
}

export default MerchantSchema