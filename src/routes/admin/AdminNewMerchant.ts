import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import Tables from '../../types/Tables'
import Merchant from '../../types/database/Merchant'
import MerchantAccount from '../../types/database/MerchantAccount'
import PathPermissions from '../../types/path/PathPermissions'

class AdminNewMerchant extends Path {
  public path = '/admin/merchants'
  public method = 'post'
  public permissions: PathPermissions = {
    check: 'admin'
  }

  public async onRequest(req: ClientRequest) {
    const username = req.body<string>('username'),
      password = req.body<string>('password'),
      uid = await this.server.utils.crypto.genUID()

    // create acc
    const data: MerchantAccount = {
        uid,
        username,
        password,
        createdAt: Date.now()
      },
      merchant: Merchant = {
        uid,
        createdAt: Date.now(),
        banner: null,
        logo: null,
        name: null,
        bio:  null,
        priceLevels: 0,
        accent: null,
        open: false
      }

    await this.server.db.table<MerchantAccount>(Tables.MerchantAccounts)
      .insert(data)

    await this.server.db.table<Merchant>(Tables.Merchant)
      .insert(merchant)

    return {
      value: merchant,
      code: 200
    }
  }
}

export default AdminNewMerchant