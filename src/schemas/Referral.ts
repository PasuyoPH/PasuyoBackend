import Schema from '../base/Schema'
import Tables from '../types/Tables'

class ReferralSchema extends Schema {
  public static tableName: string = Tables.Referral

  public async handle() {
    this.table.text('code').unique().notNullable()
    this.table.text('user').notNullable()
    this.table.bigint('createdAt').notNullable()
  }
}

export default ReferralSchema