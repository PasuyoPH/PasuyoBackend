import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import Admin from '../types/database/Admin'
import LoadRequest from '../types/database/LoadRequest'
import Merchant from '../types/database/Merchant'
import { Rider } from '../types/database/Rider'
import Transaction from '../types/database/Transaction'
import User from '../types/database/User'
import { ProtocolSendTypes } from '../types/ws/Protocol'

class AdminUtils {
  constructor(public server: HttpServer) {}

  public async getStats() {
    const { count: transactions, sum: sales } = await this.server.db.table<Transaction>(Tables.Transactions)
      .count()
      .sum('amount')
      .first(),
      { count: users } = await this.server.db.table<User>(Tables.Users)
        .count()
        .first(),
      { count: riders } = await this.server.db.table<Rider>(Tables.Riders)
        .count()
        .first()

    return {
      transactions: Number(transactions),
      users: Number(users),
      riders: Number(riders),
      sales
    }
  }

  public async getTransactions() {
    return await this.server.db.table<Transaction>(Tables.Transactions)
      .select('*')
  }

  public async approveLoadAction(uid: string, approved?: boolean) {
    const request = await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .select('*')
      .where('uid', uid)
      .first()

    if (!request)
      throw new HttpError(
        HttpErrorCodes.ADMIN_LOAD_REQUEST_INVALID,
        'This request does not exist. Please try agian.'
      )

    if (approved) // if approved, add amount to rider credits
      await this.server.db.table<Rider>(Tables.Riders)
        .update(
          { credits: this.server.db.raw('credits + ?', [request.amount]) }
        )

    // delete this request
    await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .delete()
      .where('uid', uid)

    return request
  }

  public async getLoadRequests(): Promise<(LoadRequest & { fullName: string})[]> {
    /*return await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .select('*')
      .leftJoin(Tables.Riders,)*/

    return await this.server.db
      .select(
        `${Tables.LoadRequest}.*`,
        `${Tables.Riders}.fullName`
      )
      .from(Tables.LoadRequest)
      .leftJoin(
        Tables.Riders,
        `${Tables.LoadRequest}.user`,
        `${Tables.Riders}.uid`
      )
  }

  public async getMerchants() {
    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
  }

  public async approveLoad(uid: string) {
    return await this.server.db.table<LoadRequest>(Tables.LoadRequest)
      .delete()
      .where({ uid })
  }

  public async getAdminToken(username: string, password: string) {
    const admin = await this.server.db.table<Admin>(Tables.Admins)
      .select('uid')
      .where({ username, password })
      .first()

    if (!admin)
      throw new HttpError(
        HttpErrorCodes.ADMIN_INVALID_ACCOUNT,
        'Invalid admin account provided. Please try again.'
      )
    else return await this.server.utils.tokens.encrypt(
      { uid: admin.uid, password },
      86400
    )
  }

  public async updateRiderDataToWebSocket(rider: Rider) {
    return await this.server.utils.ws.send(
      {
        c: ProtocolSendTypes.APP_UPDATE_USER_DATA,
        d: rider
      }
    )
  }

  public async setRiderCredits(uid: string, amount: number) {
    if (isNaN(amount)) amount = 0.00 // should throw error instead
    const rider = (
      await this.server.db.table<Rider>(Tables.Riders)
        .where('uid', uid)
        .increment('credits', amount)
        .returning('*')
    )[0]

    await this.updateRiderDataToWebSocket(rider)
    return rider
  }

  public async verifyRider(uid: string) {
    const rider = (
      await this.server.db.table<Rider>(Tables.Riders)
        .where('uid', uid)
        .update('verified', true)
        .returning('*')
    )[0]

    await this.updateRiderDataToWebSocket(rider)
    return rider
  }

  // returns limited info on riders
  public async getRiders() {
    return await this.server.db.table<Rider>(Tables.Riders)
      .select(
        'uid',
        'verified',
        'credits',
        'fullName',
        'phone',
        'email'
      )
  }
}

export default AdminUtils