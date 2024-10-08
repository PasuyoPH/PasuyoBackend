import ClientRequest from '../../base/ClientRequest'
import Path from '../../base/Path'
import { ItemTypes } from '../../types/database/MerchantItem'
import PathPermissions from '../../types/path/PathPermissions'

class MerchantUpdateSelf extends Path {
  public method = 'patch'
  public path = '/merchants/@me'
  public permissions: PathPermissions = {
    check: 'merchant'
  }

  public async onRequest(req: ClientRequest) {
    const name = req.body<string>('name') ?? undefined,
      bio = req.body<string>('bio') ?? undefined,
      banner = req.body<string>('banner') ?? undefined,
      logo = req.body<string>('logo') ?? undefined,
      types = req.body<ItemTypes[]>('types') ?? undefined,
      accent = req.body<string>('accent') ?? undefined,
      open = req.body<boolean>('open') ?? false,
      openAt = req.body<number>('openAt') ?? undefined,
      closedAt = req.body<number>('closedAt') ?? undefined

    return {
      value: await this.server.utils.merchant.updateMerchant(
        this.merchant,
        { name, bio, banner, logo, types, accent, open, openAt, closedAt }
      ),
      code: 200
    }
  }
}

export default MerchantUpdateSelf