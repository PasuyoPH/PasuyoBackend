import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import Tables from '../types/Tables'
import { AddressUsed } from '../types/database/AddressUsed'
import ExpoToken from '../types/database/ExpoToken'
import Job2 from '../types/database/Job2'
import Likes from '../types/database/Likes'
import Merchant from '../types/database/Merchant'
import Referral from '../types/database/Referral'
import { Rider, RiderRanks, RiderStates } from '../types/database/Rider'
import User from '../types/database/User'
import AuthCreateData from '../types/http/AuthCreateData'

class UsersUtils {
  constructor(public server: HttpServer) {}

  public async getActiveJobs(uid: string) {
    return (
      await this.server.db.table<Job2>(Tables.Jobs2)
        .select('*')
        .where('finished', false)
        .where('user', uid)
    ).length
  }

  public async getUserJobAddresses(uid: string) {
    const addresses = await this.server.db.table<AddressUsed>(Tables.AddressUsed)
      .select('*')
      .where({ jobUid: uid })

    // let client filter this out
    return addresses
  }

  // get recommended merchants based on user
  public async getRecommendedMerchants(uid: string) {
    return await this.server.db.table<Merchant>(Tables.Merchant)
      .select('*')
      .where('open', true)

    /*// fetch all user liked items
    const likedItems = await this.server.db.table<Likes>(Tables.Likes)
      .select('merchant')
      .where('user', uid)

    // let's combine our likes with the merchant score
    const scoreData: { [key: string]: number } = {} // This is where score data is temporarily stored

    // loop through user's liked items, and then calculate the necessary score based on likes first
    for (const item of likedItems)
      scoreData[item.merchant] = (scoreData[item.merchant] ?? 0) + 1

    // Now, check if we have enough for a recommendation display
    // Should be atleast 3 items to recommend
    const merchantsIds = Object.keys(scoreData)
    if (merchantsIds.length < 3) { // we don't have enough, we can instead just fill it with the merchants with top score
      // get the amount of merchants needed, and then include the current ones we have in the array
      const amountNeeded = 3 - merchantsIds.length,
        // build a query that will get the merchant with most amount of sales, excluding those we already have.
        merchants = await this.server.db.table<Merchant>(Tables.Merchant)
          .select('*')
          .where('open', true)
          .orderByRaw('CASE WHEN uid IN (?) THEN 0 ELSE 1 END, sales DESC', [merchantsIds])
          .limit(amountNeeded)

      // return the result
      return merchants
    } else { // we have enough
      // with this part, let's fetch all the merchants that got liked, and use that as a basis instead
      const merchants = await this.server.db.table<Merchant>(Tables.Merchant)
        .select('*')
        .whereIn('uid', [...merchantsIds])
        .where('open', true)

      // now let's calculate the additional score for each merchant based on sales
      for (const merchant of merchants)
        scoreData[merchant.uid] += this.server.utils.math.calculateSalesToScore(5)

      // Now finally, let's sort the merchants based on their score from greatest to least
      return merchants.sort(
        (a, b) => scoreData[b.uid] - scoreData[a.uid]
      )
    }*/
  }

  public async updateExpoToken(user: string, token: string) {
    return await this.server.db.table<ExpoToken>(Tables.ExpoTokens)
      .insert(
        {
          token,
          user
        }
      )
      .onConflict('token')
      .merge()
  }

  /**
   * Updates a user's profile.
   * @param uid The id of the user to update.
   * @param file The file to use as a profile.
   * @param rider Whether or not the user is a rider
   */
  public async updateProfile(
    uid: string,
    file: Buffer,
    rider?: boolean
  ) {
    if (!file)
      throw new HttpError(
        HttpErrorCodes.JOB_NO_IMAGE_FILE_PROVIDED,
        'Please provide a proper image file.'
      )

    const fileUrl = await this.server.utils.uploadFile(
      {
        storage: 'profiles',
        file,
        //path: '/' + uid + '/'
      }
    )
    
    // Upload to database
    const result = (
        await this.server.db.table<User | Rider>(rider ? Tables.Riders : Tables.Users)
          .update('profile', fileUrl)
          .where({ uid })
          .returning('*')
      )[0]

    // TODO: Update to ws
    if (rider && result)
      await this.server.utils.ws.updateUserToWs(result)

    return result
  }

  public async fromToken<T>(
    token: string,
    userType: 'user' | 'rider' | 'admin' | 'merchant' = 'user'
  ) {
    let table: string

    switch (userType) {
      case 'admin':
        table = Tables.Admins
        break

      case 'rider':
        table = Tables.Riders
        break

      case 'user':
        table = Tables.Users
        break

      case 'merchant':
        table = Tables.MerchantAccounts
        break
    }

    // decode token
    const decoded = await this.server.utils.tokens.decrypt<any>(token)
    if (!decoded) return

    const fields = {
      uid: decoded.uid,
      [decoded.password ? 'password' : 'pin']: decoded.password ?? decoded.pin
    }

    return await this.server.db.table<T>(table)
      .select('*')
      .where(fields)
      .first()
  }

  // Fetch all users from the database, no filters for columns
  public async all(): Promise<User[]> {
    return await this.server.db.table<User>(Tables.Users)
      .select('*')
  }

  /**
   * Deletes a user from the database.
   * @param uid ID of the user to delete.
   * @returns Boolean whether user is deleted.
   */
  public async delete(uid: string) {
    if (!uid)
      throw new HttpError(
        HttpErrorCodes.ADMIN_INVALID_USER_ID,
        'Invalid user id provided.'
      )

    const result = await this.server.db.table<User>(Tables.Users)
      .delete()
      .where({ uid })

    return result >= 1
  }

  /**
   * Get limited info of a user.
   * @param uid The id of the user to fetch.
   * @returns A limited user object, containing uid, fullName and phone.
   */
  public async getLimited(uid: string): Promise<
  {
    uid: string,
    fullName: string,
    phone: string  
  }> {
    const user = await this.server.db.table<User>(Tables.Users)
      .select(
        'uid',
        'fullName',
        'phone'
      )
      .where({ uid })
      .first()

    return user
  }

  /**
   * Creates a new user account.
   * @param data The data of the user account.
   * @param rider Whether the account to create is for user or rider.
   * @returns The auth token of the created account.
   */
  public async create(data: AuthCreateData, rider?: boolean) {
    if (
      !data.fullName ||
      data.fullName.length < 2
    )
      throw new HttpError(
        HttpErrorCodes.AUTH_INVALID_NAME,
        'Please provide a proper full name.'
      )
    
    if (!data.email?.match(/.+@.+\..+/g))
      throw new HttpError(
        HttpErrorCodes.AUTH_INVALID_EMAIL,
        'Please provide an email that matches this format: "example@domain.com"'
      )

    if (
      !data.pin ||
      data.pin.length < 4 ||
      !data.pin.match(/[0-9]/g)
    )
      throw new HttpError(
        HttpErrorCodes.AUTH_INVALID_PIN,
        'Please make sure the pin code is valid.'
      )

    // Referral code checks
    if (!rider && data.referral) {
      data.referral = data.referral
        ?.toLowerCase()
        ?.trim() ?? 'pasuyo'

      // if referral code is not pasuyo, do additional checks to see if it is real
      if (data.referral !== 'pasuyo') {
        const foundReferral = await this.server.db.table<Referral>(Tables.Referral)
          .select('code')
          .where({ code: data.referral })

        if (foundReferral.length < 1)
          throw new HttpError(
            HttpErrorCodes.AUTH_REFERRAL_NOT_EXIST,
            'This referral code does not exist. Please make sure to use an existing one.'
          )
      }
    }

    if (!data.phone.startsWith('0'))
      data.phone = '0' + data.phone

    if (data.phone.length !== 11)
      throw new HttpError(
        HttpErrorCodes.AUTH_PHONE_INVALID_LENGTH,
        'This phone number length is invalid. Please make sure to place the correct number.'
      )

    try {
      const uid = await this.server.utils.crypto.genUID(),
        referral = await this.server.utils.crypto.genUID(4),
        pushData: User | Rider = {
          ...data,
          ...(
            rider ? {
              state: RiderStates.RIDER_ONLINE,
              verified: true,
              rank: RiderRanks.RANK_BRONZE,
              xp: 0.00,
              optInLocation: true
            } : {}
          ),
          uid,
          createdAt: Date.now()
        },
        token = await this.server.utils.tokens.encrypt(
          {
            uid,
            pin: data.pin
          },
          86400
        )

      await this.server.db.table<User | Rider>(
          rider ?
            Tables.Riders :
            Tables.Users
        )
        .insert(pushData)

      // Since we created a new referral code for this user, we save it as well
      if (!rider)
        await this.server.db.table<Referral>(Tables.Referral)
          .insert(
            {
              code: referral,
              user: uid,
              createdAt: Date.now()
            }
          )

      return token
    } catch(err) {
      const code = Number(err.code)
      if (code === 23505)
        throw new HttpError(
          HttpErrorCodes.AUTH_DUPL,
          'This email or phone number provided is already used by another user. Please try again.'
        )
      else throw new HttpError(
        code,
        err.message ?? ('Request failed with code: ' + code)
      )
    }
  }

  /**
   * Converts user info to a valid user token for authentication
   * @param phone The phone of the user to auth with.
   * @param pin The pin code of the user.
   * @param rider Whether the user to authenticate is a rider or not.
   * @returns The auth token for authentication.
   */
  public async toToken(phone: string, pin: string, rider?: boolean) {
    if (phone?.startsWith('+63'))
      phone = phone.slice(3)
    
    if (!phone?.startsWith('0'))
      phone = '0' + phone

    const user = await this.server.db.table<User | Rider>(
        rider ?
          Tables.Riders :
          Tables.Users
      )
        .select('*')
        .where(
          { phone }
        )
        .first()

    if (!user)
      throw new HttpError(
        HttpErrorCodes.AUTH_FAILED,
        'This phone does not seem to be used by a user. Make sure to place the correct phone number you used.'
      )

    if (user.pin !== pin)
      throw new HttpError(
        HttpErrorCodes.AUTH_INVALID_PIN,
        'The pin code provided is incorrect. Please try again.'
      )

    return await this.server.utils.tokens.encrypt(
      {
        uid: user.uid,
        pin
      },
      86400
    )
  }
}

export default UsersUtils