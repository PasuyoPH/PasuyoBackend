import Schema from '../base/Schema'
import Tables from '../types/Tables'

class AddressSchema extends Schema {
  public static tableName: string = Tables.Address

  public async handle() {
    this.uid('uid')
      .unique()

    this.uid('user')
    this.table.double('latitude').notNullable()
    this.table.double('longitude').notNullable()

    this.table.text('text').notNullable()
    this.table.text('template').notNullable()
    this.table.text('landmark')

    this.table.text('contactPhone')//.notNullable()
    this.table.text('contactName')//.notNullable()
    this.table.bigint('createdAt').notNullable()

    this.table.boolean('merchant').defaultTo(false)
  }
}

export default AddressSchema