import Schema from '../base/Schema'

class JobSchema extends Schema {
  public static tableName = 'jobs'

  public async handle() {
    this.table.string('uid', 32)
      .notNullable()
      .primary()

    this.table.string('creator', 32)
      .notNullable()

    this.table.string('rider', 32)

    this.table.integer('type', 1)
      .notNullable()

    this.table.binary('data')
      .notNullable()
  }
}

export default JobSchema