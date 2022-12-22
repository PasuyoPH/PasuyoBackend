import Path from '../../base/Path'
import { HttpReq, IRoute } from '../../types/Http'

// request token for login
class RequestToken extends Path implements IRoute {
  public path   = '/auth/token'
  public method = 'post'

  public async onRequest(req: HttpReq) {
    const body = req.body as any,
      { email, isRider } = body,
      pin = Number(body.pin),
      data = await this.server.utils.requestToken(
        email,
        pin,
        isRider
      )

    return data ? (
      {
        value: data,
        code: 200 
      } 
    ) : (
      {
        error: true,
        message: 'Account doesn\'t exist.',
        code: 400
      }
    )
  }
}

export default RequestToken