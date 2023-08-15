import Schema from '../base/Schema'
import Tables from '../types/Tables'

class LikesSchema extends Schema {
  public static tableName: string = Tables.Likes

  public async handle() {
    this.uid('product').notNullable()
    this.uid('user').notNullable()
    this.table.bigint('likedAt').notNullable()
    this.uid('merchant').notNullable()
  }
}

export default LikesSchema