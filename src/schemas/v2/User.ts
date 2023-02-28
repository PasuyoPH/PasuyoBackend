import Schema from '../../base/Schema'
import { V2RiderStates } from '../../types/v2/db/User'

class V2UserSchema extends Schema {
  public static tableName = 'v2_users'

  public async handle() {
    this.uid('uid')

    this.table.text('email')
      .notNullable()
      .unique()

    this.table.text('phone')
      .notNullable()
      .unique()

    this.table.text('fullName')
      .notNullable()

    this.table.string('pin', 4)
      .notNullable()

    this.table.text('referral')
      .defaultTo('pasuyo')

    this.table.text('role')
      .notNullable()
  }
}

class V2RiderSchema extends V2UserSchema {
  public static tableName = 'v2_riders'

  public async handle() {
    super.handle()

    this.table.tinyint('state', V2RiderStates.RIDER_OFFLINE)
      .notNullable()

    this.table.boolean('verified')
  }
}

export {
  V2RiderSchema,
  V2UserSchema
}