import Schema from '../../base/Schema'

class V2TokensSchema extends Schema {
  public static tableName = 'v2_tokens'

  public async handle() {
    this.table.text('token')
      .unique()
      .notNullable()

    this.table.string('rider', 32)
      .notNullable()
  }
}

class V2UserTokensSchema extends Schema {
  public static tableName = 'v2_user_tokens'

  public async handle() {
    this.table.text('token')
      .unique()
      .notNullable()

    this.table.string('user', 32)
      .notNullable()
  }
}

export default V2TokensSchema
export { V2UserTokensSchema }