import Schema from '../../base/Schema'

class V2MerchantSchema extends Schema {
  public static tableName = 'v2_merchants'

  public async handle() {
    this.uid('uid') 
      .unique()

    this.table.text('name')
      .notNullable()

    this.uid('address')
    this.table.text('profile')
    this.table.text('cover')
    this.table.text('label')
    this.table.boolean('open')
  }
}

export default V2MerchantSchema