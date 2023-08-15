import Schema from '../base/Schema'
import Tables from '../types/Tables'

class OrderSchema extends Schema {
  public static tableName = Tables.Orders

  public async handle() {
    this.uid('job')
    this.uid('item')
    this.table.integer('quantity')
    this.uid('merchant')
  }
}

export default OrderSchema