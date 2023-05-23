import Schema from '../../base/Schema'

class V2ProductSchema extends Schema {
  public static tableName = 'v2_products'

  public async handle() {
    this.uid('uid')
      .notNullable()
    this.uid('merchant')

    this.table.text('name')
      .notNullable()

    this.table.double('price')
      .defaultTo(0.00)

    this.table.text('image')
      .notNullable()

    this.table.bigint('sales')
      .defaultTo(0)

    this.table.text('desc')
    this.table.boolean('available')
  }
}

export default V2ProductSchema