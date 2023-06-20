import Schema from '../../base/Schema'
import { V3AdminRoles } from '../../types/v3/db/Admin'

class V3AdminSchema extends Schema {
  public static tableName = 'v3_admins'

  public async handle() {
    this.uid('uid')
      .notNullable()

    this.table.text('username')
      .notNullable()

    this.table.text('password')
      .notNullable()

    this.table.tinyint('role')
      .defaultTo(V3AdminRoles.ACCOUNTING)

    this.table.bigint('createdAt')
      .notNullable()
  }
}

export default V3AdminSchema