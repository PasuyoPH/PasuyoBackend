import Schema from '../../base/Schema';

class V2PromosSchema extends Schema {
  public static tableName = 'v2_promos'

  public async handle() {
    this.uid('uid')
      .unique()
    
      this.table.text('url')
        .notNullable()

      this.table.boolean('available')
  }
}

export default V2PromosSchema