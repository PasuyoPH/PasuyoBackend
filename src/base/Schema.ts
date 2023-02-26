import { Knex } from 'knex'

class Schema {
  public static tableName: string = ''

  constructor(public table: Knex.TableBuilder) {}

  public async handle() {}
}

export default Schema