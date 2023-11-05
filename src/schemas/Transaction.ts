import Schema from '../base/Schema'
import Tables from '../types/Tables'
import { TransactionStatus } from '../types/database/Transaction'

class TransactionSchema extends Schema {
  public static tableName: string = Tables.Transactions

  public async handle() {
    this.table.text('uid').notNullable()
    this.table.tinyint('status').defaultTo(TransactionStatus.WAITING_USER_PAYMENT)
    this.table.double('amount').defaultTo(0.00)
    this.uid('user')
    this.table.bigint('createdAt').notNullable()
    this.table.string('currency', 3).notNullable().defaultTo('PHP')
    this.table.text('receipt')
    this.table.text('merchant')
    this.table.text('job').notNullable()
  }
}

export default TransactionSchema