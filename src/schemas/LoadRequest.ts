import Schema from '../base/Schema'
import Tables from '../types/Tables'

class LoadRequestSchema extends Schema {
  public static tableName: string = Tables.LoadRequest

  public async handle() {
    this.uid('uid').unique()
    this.uid('rider')
    this.table.text('url').notNullable()
  }
}

export default LoadRequestSchema