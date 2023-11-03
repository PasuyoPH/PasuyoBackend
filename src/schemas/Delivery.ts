import Schema from '../base/Schema'
import Tables from '../types/Tables'
import { DeliveryStatus } from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'

class DeliverySchema extends Schema {
  public static tableName = Tables.Deliveries

  public async handle() {
    this.uid('uid').unique()
    this.table.double('weight').defaultTo(0.00)
    this.table.text('name').notNullable()
    
    this.table.bigint('createdAt').notNullable()

    this.table.bigint('startedAt')
    this.table.bigint('endedAt')

    this.table.double('distance').defaultTo(0.00)
    this.table.double('eta').defaultTo(0.00)

    this.table.string('proof')
    this.table.string('rider', 32)

    this.table.tinyint('status').defaultTo(DeliveryStatus.DELIVERY_PROCESSED)
    this.uid('user')

    this.uid('deliverTo').notNullable()
    this.table.boolean('draft').defaultTo(true)

    // fees
    this.table.double('fee').defaultTo(0.00)
    this.table.double('riderFee').defaultTo(0.00)

    this.table.tinyint('type').defaultTo(JobTypes.DELIVERY)
    this.table.text('image').notNullable()
  }
}

export default DeliverySchema