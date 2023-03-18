import Schema from '../base/Schema'

class RiderSchema extends Schema {
  public static tableName = 'riders'

  public async handle() {
    this.table.string('uid', 32)
      .notNullable()
      .primary()

    this.table.text('email')
      .notNullable()
      .unique()

    this.table.text('phone')
      .notNullable()
      .unique()

    this.table.text('fullName')
      .notNullable()

    this.table.string('pin', 4)
      .notNullable()

    this.table.boolean('verified')
    this.table.text('referral')
      .defaultTo('pasuyo')

    this.table.tinyint('role')
      .notNullable()
  }
}

export default RiderSchema