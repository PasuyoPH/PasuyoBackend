import Schema from '../base/Schema'
import Tables from '../types/Tables'

class Job2Schema extends Schema {
  public static tableName = Tables.Jobs2

  public async handle() {
    this.uid('uid').unique()
    this.table.string('rider', 32).notNullable()
    
    this.uid('user')
    this.table.tinyint('type', 1).notNullable()
    
    this.uid('dataUid')
    this.table.bigint('createdAt').notNullable()

    this.table.boolean('finished').defaultTo(false)
    this.table.boolean('pickedUp').defaultTo(false)
    this.table.boolean('cancelled').defaultTo(false)
  }
}

export default Job2Schema