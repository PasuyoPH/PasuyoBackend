import Schema from '../base/Schema'
import Tables from '../types/Tables'

class NotificationSchema extends Schema {
  public static tableName: string = Tables.Notifications

  public async handle() {
    this.uid('uid')
      .unique()

    this.uid('user')
    this.table.text('title').notNullable()
    this.table.text('body').defaultTo('Empty.')
    this.table.bigint('receivedAt').notNullable()
  }
}

export default NotificationSchema