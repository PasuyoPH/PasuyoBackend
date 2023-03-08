import Schema from '../base/Schema'

class CustomerSchema extends Schema {
  public static tableName = 'customers'
  
  public async handle() {
    this.table.string('uid', 32)
      .notNullable()
      .unique()

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

    this.table.text('referral')
      .defaultTo('pasuyo')

    this.table.tinyint('role')
      .notNullable()
  }
}

export default CustomerSchema