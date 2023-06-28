enum AddressUsedType {
  START,
  MID,
  END
}

// Database data for addresses used in jobs
interface AddressUsed {
  //uid: string // Unique id identifier ( unused )

  // address data
  addressUid: string
  latitude: number
  longitude: number

  // job data
  jobUid: string

  // AddressUsed main data
  type: AddressUsedType // Whether this is the starting point, midpoints or end point
  index: number // Only use if midpoint, otherwise value should be -1. Starts at 0

  createdAt: number

  text: string
  landmark?: string
}

export {
  AddressUsed,
  AddressUsedType
}