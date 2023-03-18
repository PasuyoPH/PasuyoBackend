import { Geo } from '../Geo'

interface V2HttpCalculateDistance {
  points: Geo[]
}

enum V2CalculateDistanceSatus {
  OK,
  FAILED
}

interface V2CalculateDistanceResult {
  distance: number // in meters
  duration: number // in seconds
  status: V2CalculateDistanceResult
}

export {
  V2CalculateDistanceSatus,
  V2CalculateDistanceResult,

  V2HttpCalculateDistance
}