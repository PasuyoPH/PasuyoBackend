import User from './User'

enum RiderStates {
  RIDER_ONLINE,
  RIDER_UNAVAILABLE,
  RIDER_OFFLINE
}

enum RiderRanks {
  RANK_BRONZE,
  RANK_GOLD,
  RANK_PLATINUM,
  RANK_DIAMOND,
  RANK_BLACK_DIAMOND
}

interface Rider extends User {
  verified?: boolean
  state: RiderStates
  rank: RiderRanks
  xp: number // unused value for now
  optInLocation: boolean
  id?: string
}

export {
  RiderStates,
  RiderRanks,
  Rider
}