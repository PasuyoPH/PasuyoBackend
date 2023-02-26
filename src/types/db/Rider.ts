enum IRiderStates {
  RIDER_OFFLINE,
  RIDER_AVAILABLE,
  RIDER_UNAVAILABLE
}

// Rider Job Structure
/*
  00
  00 -- Type (2 bytes)

  00* -- Job ID
*/

interface IRider {
  uid?: string
  email?: string
  
  phone?: string
  fullName?: string

  pin?: string
  state?: IRiderStates

  verified?: boolean
}

export {
  IRiderStates,
  IRider
}