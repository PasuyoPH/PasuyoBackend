import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import UploadFileOptions from '../types/UploadFileOptions'
import { S3 } from '@aws-sdk/client-s3'
import TokenUtils from './Token'
import UsersUtils from './Users'
import CryptoUtils from './Crypto'
import RiderUtils from './Rider'
import AddressUtils from './Address'
import MathUtils from './Math'
import JobUtils from './Job'
import ClientRequest from '../base/ClientRequest'
import busboy from 'busboy'
import Promos from '../types/database/Promos'
import Tables from '../types/Tables'
import NotificationUtils from './Notification'
import WsUtils from './Websocket'
import { Rider } from '../types/database/Rider'

class Utils {
  public tokens: TokenUtils
  public users: UsersUtils
  public crypto: CryptoUtils
  public riders: RiderUtils
  public addresses: AddressUtils
  public math: MathUtils
  public jobs: JobUtils
  public notifications: NotificationUtils
  public ws: WsUtils

  constructor(public server: HttpServer) {
    this.tokens = new TokenUtils(this.server)
    this.users = new UsersUtils(this.server)
    this.crypto = new CryptoUtils(this.server)
    this.riders = new RiderUtils(this.server)
    this.addresses = new AddressUtils(this.server)
    this.math = new MathUtils(this.server)
    this.jobs = new JobUtils(this.server)
    this.notifications = new NotificationUtils(this.server)
    this.ws = new WsUtils(this.server)
  }

  public async fetchRiders(ids: string[]) {
    return await this.server.db.table<Rider>(Tables.Riders)
      .select('uid', 'state', 'credits')
      .whereIn('uid', ids ?? [])
  }

  public async uploadFile(options: UploadFileOptions) {
    const bucket = this.server.storages[options.storage] as S3
    if (!bucket)
      throw new HttpError(
        HttpErrorCodes.FILE_UPLOAD_NO_BUCKET,
        'No bucket found for: ' + options.storage
      )

    if (!Buffer.isBuffer(options.file))
      throw new HttpError(
        HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide a proper image to upload.'
      )

    const fileHash = await this.server.utils.crypto.generateFileHash(options.file),
      storageUrl = this.server.config.s3.storages[options.storage].url,
      filePath = (options.path ?? '') + (fileHash + '.jpg')

    // Upload to s3 bucket
    await bucket.putObject(
      {
        Bucket: 'sin1',
        Key: filePath,
        Body: options.file
      }
    )

    return storageUrl + filePath
  }

  public async getPromos() {
    return await this.server.db.table<Promos>(Tables.Promos)
      .select('*')
  }

  public parseFile(req: ClientRequest): Promise<Buffer> {
    return new Promise(
      (resolve, reject) => {
        const bus = busboy(
          { headers: req.req.headers }
        )

        bus.on(
          'file',
          (_, stream) => {
            let chunk: Buffer

            stream.on(
              'data',
              (data: Buffer) => {
                if (!chunk) chunk = data
                else chunk = Buffer.concat(
                  [chunk, data]
                )
              }
            )
            .on('end', () => resolve(chunk))
            .on('error', reject)
          }
        )
        .on('error', reject)

        req.req.pipe(bus)
      }
    )
  }
}

export default Utils