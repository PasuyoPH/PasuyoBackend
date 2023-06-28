import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import jsonwebtoken from 'jsonwebtoken'
import HttpServer from '../base/HttpServer'
import EncryptedToken from '../types/token/EncryptedToken'

class TokenUtils {
  constructor(public server: HttpServer) {}

  public encrypt(data: any, expiresIn: number): Promise<string> {
    return new Promise(
      (resolve) => {
        const iv = randomBytes(16),
          token = jsonwebtoken.sign(
              data,
              this.server.config.jwt_secret,
              { expiresIn: expiresIn * 1000 }
            ),
            cipher = createCipheriv(
              'aes-256-ctr',
              this.server.config.cypher_iv_key,
              iv
            ),
            encrypted = Buffer.concat(
              [
                cipher.update(token),
                cipher.final()
              ]
            )
          
        // create one more jwt token, this time containing the encrypted version and iv
        return resolve(
          jsonwebtoken.sign(
            {
              iv: iv.toString('hex'),
              token: encrypted.toString('hex'),
              expresAt: Date.now() + (expiresIn * 1000)
            },
            this.server.config.jwt_secret
          )
        )
      }
    )
  }

  public decrypt<T>(token: string): Promise<T | null> {
    return new Promise(
      (resolve) => {
        try {
          jsonwebtoken.verify(token, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const data: EncryptedToken = jsonwebtoken.decode(token)
        if (Date.now() >= data.expiresAt) return null

        const decipher = createDecipheriv(
            'aes-256-ctr',
            this.server.config.cypher_iv_key,
            Buffer.from(data.iv, 'hex')
          ),
          decrypted = Buffer.concat(
            [
              decipher.update(
                Buffer.from(data.token, 'hex')
              ),
              decipher.final()
            ]
          )

        const jwt = decrypted.toString()
        try {
          jsonwebtoken.verify(jwt, this.server.config.jwt_secret)
        } catch { return resolve(null) }

        const jsonData = jsonwebtoken.decode(jwt) as T
        return resolve(jsonData)
      }
    )
  }
}

export default TokenUtils