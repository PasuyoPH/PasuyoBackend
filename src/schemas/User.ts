import Schema from '../base/Schema'
import Tables from '../types/Tables'

class UserSchema extends Schema {
  public static tableName: string = Tables.Users

  public async handle() {
    this.uid('uid').unique()
    this.table.text('email').notNullable().unique()
    this.table.text('phone').notNullable().unique()
    this.table.text('fullName').notNullable()
    this.table.text('pin').notNullable()
    this.table.text('referral')
    this.table.double('credits').defaultTo(0).notNullable()
    this.table.text('profile')
    this.table.bigint('createdAt').notNullable()
  }
}

export default UserSchema