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
import AdminUtils from './Admin'
import MerchantUtils from './Merchant'
import OrderUtils from './Orders'
import Job2Utils from './Job2'
import PaypalUtils from './Paypal'
import CashUtils from './Cash'
import axios from 'axios'
import { ReverseGeocodingResponse } from '../types/http/Geocode'
import PaymentUtils from './Payment'
import DeliveryUtils from './Delivery'
import GCashUtils from './GCash'

class Utils {
  public admins: AdminUtils
  public tokens: TokenUtils
  public users: UsersUtils
  public crypto: CryptoUtils
  public riders: RiderUtils
  public addresses: AddressUtils
  public math: MathUtils
  public jobs: JobUtils
  public jobs2: Job2Utils
  public notifications: NotificationUtils
  public ws: WsUtils
  public merchant: MerchantUtils
  public orders: OrderUtils
  public paypal: PaypalUtils
  public cash: CashUtils
  public payment: PaymentUtils
  public deliveries: DeliveryUtils
  public gcash: GCashUtils

  constructor(public server: HttpServer) {
    this.admins = new AdminUtils(this.server)
    this.tokens = new TokenUtils(this.server)
    this.users = new UsersUtils(this.server)
    this.crypto = new CryptoUtils(this.server)
    this.riders = new RiderUtils(this.server)
    this.addresses = new AddressUtils(this.server)
    this.math = new MathUtils(this.server)
    this.jobs = new JobUtils(this.server)
    this.jobs2 = new Job2Utils(this.server)
    this.notifications = new NotificationUtils(this.server)
    this.ws = new WsUtils(this.server)
    this.merchant = new MerchantUtils(this.server)
    this.orders = new OrderUtils(this.server)
    this.paypal = new PaypalUtils(this.server)
    this.cash = new CashUtils(this.server)
    this.payment = new PaymentUtils(this.server)
    this.deliveries = new DeliveryUtils(this.server)
    this.gcash = new GCashUtils(this.server)
  }

  public async reverseGeoCode(lat: number, long: number) {
    // send geo reverse request
    const res = await axios(
      {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyAe1O4RsaElYL79mHnPSHRGL_lVCf9uP0M`
      }
    ) as { data: ReverseGeocodingResponse }

    if (res.data.status !== 'OK')
      throw new HttpError(
        HttpErrorCodes.GEOCODE_FAILED,
        'Reverse geocode failed.'
      )

    const [address] = res.data.results
    if (!address)
      throw new HttpError(
        HttpErrorCodes.GEOCODE_ADDRESS_NOT_FOUND,
        'Address was not found.'
      )

    return address.formatted_address
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

    return storageUrl + '/' + filePath
  }

  public async uploadProfile(file: Buffer) {
    if (!file)
      throw new HttpError(
        HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide a proper image file.'
      )

    try {
      const fileUrl = await this.uploadFile(
      {
        storage: 'profiles',
        file
      }
    )

    return fileUrl
    }
    catch(err){ console.log(err) }
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