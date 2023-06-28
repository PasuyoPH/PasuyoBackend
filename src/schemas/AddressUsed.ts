import Schema from '../base/Schema'
import Tables from '../types/Tables'

class AddressUsedSchema extends Schema {
  public static tableName: string = Tables.AddressUsed

  public async handle() {
    this.uid('addressUid')
    this.table.double('latitude').notNullable()
    this.table.double('longitude').notNullable()

    this.uid('jobUid')
    this.table.tinyint('type').notNullable()
    this.table.tinyint('index').notNullable()
    this.table.bigint('createdAt').notNullable()

    // Address data
    this.table.text('text').notNullable()
    this.table.text('landmark')
  }
}

export default AddressUsedSchema