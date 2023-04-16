import Schema from '../../base/Schema'

// schema for transaction
class V2LoadRequestSchema extends Schema {
  public static tableName = 'v2_loadrequests'

  public async handle() {
    this.uid('rider')
    this.uid('uid')
      .unique()

    this.table.text('proof')
      .notNullable()
  }
}

export default V2LoadRequestSchema