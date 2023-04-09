import Schema from '../../base/Schema'

// schema for referral codes
class V2ReferralSchema extends Schema {
  public static tableName = 'v2_codes'

  public async handle() {
    this.table.string('code', 8)
      .notNullable()
      .unique()

    this.uid('user')
      .unique()

    this.table.bigInteger('createdAt')
      .notNullable()
  }
}

export default V2ReferralSchema