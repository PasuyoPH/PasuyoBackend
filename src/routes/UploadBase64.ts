import ClientRequest from '../base/ClientRequest'
import Path from '../base/Path'

class UploadBase64 extends Path {
  public method = 'post'
  public path = '/base64'

  public async onRequest(req: ClientRequest) {
    const file = req.body<string>('file')

    return {
      value: await this.server.utils.uploadBase64(file),
      code: 200
    }
  }
}

export default UploadBase64