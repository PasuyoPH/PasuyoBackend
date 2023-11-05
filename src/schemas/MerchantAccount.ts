import Schema from '../base/Schema'
import Tables from '../types/Tables'

class MerchantAccountSchema extends Schema {
  public static tableName: string = Tables.MerchantAccounts

  public async handle() {
    this.uid('uid').unique()
    this.table.text('username').unique().notNullable()
    this.table.text('password').notNullable()
    this.table.bigint('createdAt').notNullable()
  }
}

export default MerchantAccountSchema