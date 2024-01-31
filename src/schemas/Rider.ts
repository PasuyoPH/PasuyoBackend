import Tables from '../types/Tables'
import { RiderMode, RiderRanks, RiderStates } from '../types/database/Rider'
import UserSchema from './User'

class RiderSchema extends UserSchema {
  public static tableName: string = Tables.Riders

  public async handle() {
    super.handle()

    this.table.boolean('verified').defaultTo(false)
    this.table.tinyint('state').defaultTo(RiderStates.RIDER_ONLINE)
    this.table.tinyint('rank').defaultTo(RiderRanks.RANK_BRONZE)
    this.table.double('xp').defaultTo(0.00)
    this.table.boolean('optInLocation').defaultTo(false)
    this.table.text('id')
    this.table.tinyint('mode').defaultTo(RiderMode.COMPLETE)
  }
}

export default RiderSchema