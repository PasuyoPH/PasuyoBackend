import Schema from '../base/Schema'

class DeliveriesSchema extends Schema {
  public static tableName = 'deliveries'

  public async handle() {
    this.table.string('uid', 16)
      .notNullable()
      .primary()

    this.table.text('item')
      .notNullable()

    this.table.text('fromFullName')
      .notNullable()

    this.table.text('fromAddress')
      .notNullable()

    this.table.text('fromLandmark')
    this.table.text('toLandmark')
  
    this.table.text('toFullName')
      .notNullable()

    this.table.text('toAddress')
      .notNullable()

    this.table.string('creator', 32)
      .notNullable()

    this.table.tinyint('status', 1)
      .notNullable()
  }
}

export default DeliveriesSchema