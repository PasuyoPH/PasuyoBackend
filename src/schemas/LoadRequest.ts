import Schema from '../base/Schema'
import Tables from '../types/Tables'

class LoadRequestSchema extends Schema {
  public static tableName: string = Tables.LoadRequest

  public async handle() {
    this.uid('uid').unique()
    this.uid('user')
    this.table.text('receipt').notNullable()
    this.table.double('amount').notNullable().defaultTo(0.00)
  }
}

export default LoadRequestSchema