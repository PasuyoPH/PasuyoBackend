import Schema from '../../base/Schema'

// View user notifications
class V2NotificationsSchema extends Schema {
  public static tableName = 'v2_notifications'

  public async handle() {
    this.uid('uid')
      .unique()
    this.uid('user')

    this.table.bigInteger('createdAt')
      .notNullable()

    this.table.text('title')
      .notNullable()

    this.table.text('body')
      .notNullable()
  }
}

export default V2NotificationsSchema