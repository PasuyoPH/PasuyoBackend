import { Knex } from 'knex'

class Schema {
  public static tableName: string = ''

  constructor(public table: Knex.TableBuilder) {}

  public uid(table: string) {
    return this.table.string(table, 32)
      .notNullable()
  }

  public async handle() {}
}

export default Schema