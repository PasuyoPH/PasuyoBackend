import HttpServer from '../base/HttpServer'
import Tables from '../types/Tables'
import { AddressUsed } from '../types/database/AddressUsed'
import Delivery from '../types/database/Delivery'
import { JobTypes } from '../types/database/Job'
import Order from '../types/database/Order'
import Transaction, { TransactionStatus } from '../types/database/Transaction'
import PaymentCreated from '../types/http/PaymentCreated'

class CashUtils {
  constructor(public server: HttpServer) {}

  // We basically just insert a transaction object to the database and
  // create the job immediately. No need for other verifications as this is pay with cash on delivery
  public async createPayment(user: string, uid: string, type: JobTypes): Promise<PaymentCreated> {
    const job = await this.server.utils.payment.getJobData(uid, type),
      generatedId = await this.server.utils.crypto.genUID()

    // save our payment ( but as pending ) to database
    await this.server.db.table<Transaction>(Tables.Transactions)
      .insert(
        {
          uid: generatedId,
          status: TransactionStatus.COD_WAITING_FOR_PAYMENT,
          amount: job.total,
          user,
          job: uid,
          createdAt: Date.now()
        }
      )

    // if delivery, unmark as draft.
    switch (job.type) {
      case JobTypes.DELIVERY: {
        // unmark as draft & send to riders
        await this.server.db.table<Delivery>(Tables.Deliveries)
          .update({ draft: false })
          .where({ uid })

        // todo: send to riders
      } break

      case JobTypes.ORDER: {
        // unmark as draft & send to riders
        await this.server.db.table<Order>(Tables.Orders)
          .update({ draft: false })
          .where({ uid })

        // todo: send to riders
      } break
    }

    const address = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
      .select('latitude', 'longitude')
      .where('jobUid', uid)
      .first()

    if (!address) return
    
    // notify riders
    if (this.server.config.ws.enabled)
      await this.server.ws.send(
        JSON.stringify(
          {
            c: 2,
            d: {
              uid,
              geo: {
                latitude: address.latitude,
                longitude: address.longitude
              }
            }
          }
        )
      )
    
    return {
      id: generatedId,
      redirectTo: null
    }
  }
}

export default CashUtils