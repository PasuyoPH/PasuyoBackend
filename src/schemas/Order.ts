import Schema from '../base/Schema'
import Tables from '../types/Tables'
import { JobTypes } from '../types/database/Job'
import { OrderStatus } from '../types/database/Order'

class OrderSchema extends Schema {
  public static tableName = Tables.Orders

  public async handle() {
    this.uid('uid').unique()
    this.table.text('items').notNullable()
    this.uid('merchant')
    this.table.double('total').defaultTo(0.00) // this should be universal to all
    this.table.bigint('createdAt').notNullable()

    this.table.bigint('startedAt')
    this.table.bigint('endedAt')

    this.table.double('distance').defaultTo(0.00)
    this.table.double('eta').defaultTo(0.00)

    this.table.string('proof')
    this.table.string('rider', 32)

    this.table.tinyint('status').defaultTo(OrderStatus.ORDER_PROCESSED)
    this.uid('user')

    this.uid('deliverTo').notNullable()
    this.table.boolean('draft').defaultTo(true)

    this.table.tinyint('type').defaultTo(JobTypes.ORDER)
    this.table.double('pf').defaultTo(0.00)

    this.table.boolean('pending').defaultTo(true)
  }
}

export default OrderSchema