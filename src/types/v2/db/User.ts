enum V2RiderStates {
  RIDER_ONLINE,
  RIDER_UNAVAILABLE,
  RIDER_OFFLINE
}

enum V2UserRoles {
  CUSTOMER,
  RIDER,
  ADMIN,
  INVALID
}

interface V2User {
  uid?: string
  email?: string
  phone?: string
  fullName?: string
  pin?: string
  role?: V2UserRoles
  referral?: string
  credits?: number
  profile?: string
}

enum V2RiderRanks {
  RANK_BRONZE,
  RANK_GOLD,
  RANK_PLATINUM,
  RANK_DIAMOND,
  RANK_BLACK_DIAMOND
}

interface V2Rider extends V2User {
  verified?: boolean
  state: V2RiderStates
  rank: V2RiderRanks
  xp: number // unused value for now
  optInLocation: boolean
  id?: string
}

export {
  V2Rider,
  V2RiderStates,
  V2RiderRanks,

  V2User,
  V2UserRoles
}