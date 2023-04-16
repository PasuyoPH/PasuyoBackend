import Schema from '../../base/Schema'

// schema for transaction
class V2TransactionSchema extends Schema {
  public static tableName = 'v2_transactions'

  public async handle() {
    this.uid('uid')
      .unique()
    
    this.uid('target')
    this.table.double('credits')
      .notNullable()
      .defaultTo(0.00)
  }
}

export default V2TransactionSchema