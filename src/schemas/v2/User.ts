import Schema from '../../base/Schema'
import { V2RiderRanks, V2RiderStates } from '../../types/v2/db/User'

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

    this.table.text('pin')
      .notNullable()

    this.table.text('referral')
      .defaultTo('pasuyo')

    this.table.tinyint('role')
      .notNullable()

    this.table.double('credits')
      .notNullable()
      .defaultTo(0)

    this.table.text('profile')
    this.table.boolean('optInLocation')
      .defaultTo(true)
  }
}

class V2RiderSchema extends V2UserSchema {
  public static tableName = 'v2_riders'

  public async handle() {
    super.handle()

    this.table.tinyint('state', V2RiderStates.RIDER_OFFLINE)
      .notNullable()

    this.table.boolean('verified')
    this.table.tinyint('rank')
      .notNullable()
      .defaultTo(V2RiderRanks.RANK_BRONZE)
    this.table.double('xp')
      .defaultTo(0)
  }
}

export {
  V2RiderSchema,
  V2UserSchema
}