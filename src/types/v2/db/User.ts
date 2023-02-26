enum V2RiderStates {
  RIDER_ONLINE,
  RIDER_UNAVAILABLE,
  RIDER_OFFLINE
}

interface V2User {
  uid?: string
  email?: string

  phone?: string
  fullName?: string

  pin?: string
  role?: 'CUSTOMER' | 'RIDER' | 'ADMIN'
}

interface V2Rider extends V2User {
  state?: V2RiderStates
  verified?: boolean
}

export {
  V2Rider,
  V2RiderStates,

  V2User
}