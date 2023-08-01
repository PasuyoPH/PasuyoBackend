import Schema from '../base/Schema'
import { PickupPaymentTypes } from '../types/Services'
import Tables from '../types/Tables'
import { JobStatus } from '../types/database/Job'

class JobSchema extends Schema {
  public static tableName = Tables.Jobs
  
  public async handle() {
    this.uid('uid').unique()
    this.uid('user')
    this.table.text('rider')
    this.table.tinyint('type')
    this.table.tinyint('status').defaultTo(JobStatus.PROCESSED)
    this.table.bigint('createdAt').notNullable()

    this.table.bigint('startedAt')
    this.table.bigint('finishedAt')

    this.table.boolean('draft').defaultTo(false)
    
    this.table.double('distance').defaultTo(0.00)
    this.table.double('fee').defaultTo(0.00)
    this.table.double('eta').defaultTo(0.00)

    this.table.double('riderFee')

    this.table.text('item')
    this.table.double('weight')

    this.table.text('proof')
    this.table.tinyint('cashPickup').defaultTo(PickupPaymentTypes.DROPOFF).checkBetween(
      [
        PickupPaymentTypes.DROPOFF,
        PickupPaymentTypes.PICKUP
      ]
    )
  }
}

export default JobSchema