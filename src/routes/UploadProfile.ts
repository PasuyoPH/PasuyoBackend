import ClientRequest from '../base/ClientRequest'
import Path from '../base/Path'

class UploadProfile extends Path {
  public method = 'post'
  public path = '/profile'

  public async onRequest(req: ClientRequest) {
    const file = await this.server.utils.parseFile(req)

    return {
      value: await this.server.utils.uploadProfile(file),
      code: 200
    }
  }
}

export default UploadProfile