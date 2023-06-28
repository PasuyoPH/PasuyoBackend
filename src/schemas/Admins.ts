import Schema from '../base/Schema'
import Tables from '../types/Tables'
import { AdminRoles } from '../types/database/Admin'

class AdminSchema extends Schema {
  public static tableName: string = Tables.Admins

  public async handle() {
    this.uid('uid').unique()
    this.table.text('username').unique().notNullable()
    this.table.text('password').notNullable()
    this.table.tinyint('role').notNullable().defaultTo(AdminRoles.ACCOUNTING)
    this.table.bigint('createdAt').notNullable()
  }
}

export default AdminSchema