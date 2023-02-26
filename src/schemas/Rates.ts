import Schema from '../base/Schema'

// Schema for rating system
class RatesSchema extends Schema {
  public static tableName = 'rates'

  public async handle() {
    this.table.string('uid', 32)
      .notNullable()
      .primary()

    this.table.string('rider', 32)
      .notNullable()

    this.table.text('comment')
    this.table.double('rating', 2)
      .notNullable()

    this.table.string('by', 32)
      .notNullable()
  }
}

export default RatesSchema