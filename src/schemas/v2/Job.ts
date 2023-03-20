import Schema from '../../base/Schema'
import { V2JobStatus } from '../../types/v2/db/Job'

class V2JobSchema extends Schema {
  public static tableName = 'v2_jobs'

  public async handle() {
    this.uid('uid')
      .unique()
    
    this.uid('creator')
    this.table.text('rider')

    this.table.tinyint('type', 1)
      .notNullable()

    this.table.tinyint('status', V2JobStatus.PROCESSED)
      .notNullable()

    this.table.binary('startPoint')
      .notNullable()
    
    this.table.binary('finalPoint')
      .notNullable()

    this.table.binary('midPoints')

    this.table.bigint('startedAt')
    this.table.bigint('finishedAt')
  
    this.table.text('other')
    this.table.boolean('showInList')
    this.table.boolean('draft')
    
    this.table.double('distance')
      .notNullable()
    
    this.table.double('fee')
      .notNullable()

    this.table.double('eta')
      .notNullable()

    // service specific data
    
    // delivery
    this.table.text('item')
    this.table.double('weight')
  }
}

export default V2JobSchema