import { URLSearchParams } from 'url'
import HttpError from '../base/HttpError'
import HttpServer from '../base/HttpServer'
import HttpErrorCodes from '../types/ErrorCodes'
import { BASE_DELIVERY_FEE, DEFAULT_INCOME_RATE, IncomeRates } from '../types/Fees'
import { Geo } from '../types/database/Address'
import { Rider, RiderRanks } from '../types/database/Rider'
import axios from 'axios'

const API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json',
  LIKE_MULTIPLIER = 1.2,
  SALES_MULTIPLIER = .8

class MathUtils {
  constructor(public server: HttpServer) {}

  public calculateScore(likes: number, sales: number) {
    const totalLikesScore = likes * LIKE_MULTIPLIER,
      totalSalesScore = sales * SALES_MULTIPLIER

    return totalLikesScore + totalSalesScore
  }

  public calculateLikeToScore(likes: number) {
    return likes * LIKE_MULTIPLIER
  }

  public calculateSalesToScore(sales: number) {
    return sales * SALES_MULTIPLIER
  }

  public async calculateXp(distance: number) {
    return this.server.config.xp.unitPerDistance *
      Math.pow(
        distance,
        this.server.config.xp.scale
      )
  }

  public calculateDeliveryFee(distance: number | string) {
    if (typeof distance === 'string')
      distance = Number(distance)

    return Math.round(
      BASE_DELIVERY_FEE + (
        (distance - 1) * 10
      )
    )
  }

  public getRiderRates(rider: Rider) {
    return IncomeRates[rider.rank ?? RiderRanks.RANK_BRONZE] ?? DEFAULT_INCOME_RATE
  }

  public async calculateDistance(points: Geo[], rider?: Rider) {
    if (
      !Array.isArray(points) ||
      points.length < 2
    )
      throw new HttpError(
        HttpErrorCodes.DISTANCE_INVALID_POINTS,
        'Invalid points provided. Make sure to have atleast 2.'
      )

    const [origin, ...destinations] = points,
      encode = (point: Geo) => {
        if (
          typeof point.latitude !== 'number' ||
          typeof point.longitude !== 'number'
        )
          throw new HttpError(
            HttpErrorCodes.DISTANCE_MUST_BE_FLOAT,
            'Please provide a float for the points.'
          )

        return point.latitude + ',' + point.longitude
      },
      params = new URLSearchParams()

    params.append('origins', encode(origin))
    params.append(
      'destinations',
      destinations.map(
        (point) => encode(point)
      ).join('|')
    )
    params.append('key', this.server.config.google.apikey)

    const { data } = await axios(
        {
          method: 'get',
          url: API_URL + '?' + params.toString()
        }
      ),
      results = data.rows[0].elements

    if (
      results[0] &&
      results[0].status === 'ZERO_RESULTS'
    )
      throw new HttpError(
        HttpErrorCodes.DISTANCE_CANT_FIND_PATH,
        'Can\'t find a proper path for this route.'
      )

    let totalMeters = 0,
      totalSeconds = 0

    for (const result of results) {
      totalMeters += result.distance?.value ?? 0
      totalSeconds += result.duration?.value ?? 0
    }

    const fee = this.calculateDeliveryFee(totalMeters / 1000)
    return {
      fee,
      distance: Math.round(
        (totalMeters / 1000) * 10
      ) / 10, // km
      eta: totalSeconds,
      riderFee: rider ?
        fee * this.server.utils.math.getRiderRates(rider) :
        null
    }
  }
}

export default MathUtils