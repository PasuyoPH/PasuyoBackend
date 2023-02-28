import Schema from '../../base/Schema'

class V2AddressSchema extends Schema {
  public static tableName = 'v2_address'

  public async handle() {
    this.uid('uid')
      .unique()
    
    this.uid('user')

    this.table.double('latitude')
      .notNullable()

    this.table.double('longitude')
      .notNullable()

    this.table.text('formattedAddress')
      .notNullable()

    // additional data
    this.table.text('house')
    this.table.text('contactPhone')
    
    this.table.text('contactName')
  }
}

export default V2AddressSchema