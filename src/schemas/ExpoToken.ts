import Schema from '../base/Schema'
import Tables from '../types/Tables'

class ExpoTokenSchema extends Schema {
  public static tableName = Tables.ExpoTokens

  public async handle() {
    this.table.text('token')
      .unique()
      .notNullable()

    this.table.string('user', 32)
      .notNullable()
  }
}

export default ExpoTokenSchema