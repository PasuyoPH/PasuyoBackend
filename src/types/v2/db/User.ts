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
}

interface V2Rider extends V2User {
  verified?: boolean
}

export {
  V2Rider,
  V2RiderStates,

  V2User,
  V2UserRoles
}