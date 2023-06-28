import { createHash, randomBytes } from 'crypto'
import HttpServer from '../base/HttpServer'

class CryptoUtils {
  constructor(public server: HttpServer) {}

  public async generateFileHash(content: Buffer) {
    const hash = createHash('sha256')
    hash.update(content)

    return hash.digest('hex')
  }

  public genUID(len: number = 16): Promise<string> {
    return new Promise(
      (resolve) => resolve(
        randomBytes(len)
          .toString('hex')
      )
    )
  }
}

export default CryptoUtils