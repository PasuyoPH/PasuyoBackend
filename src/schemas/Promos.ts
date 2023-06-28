import Schema from '../base/Schema'
import Tables from '../types/Tables'

class PromoSchema extends Schema {
  public static tableName: string = Tables.Promos

  public async handle() {
    this.uid('uid')
      .unique()

    this.table.text('url').notNullable()
    this.table.boolean('available').defaultTo(false)
  }
}

export default PromoSchema