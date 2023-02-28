// user addresses
interface V2Address {
  uid?: string
  user?: string

  latitude?: number
  longitude?: number

  formattedAddress?: string // the text form of the address
  
  // Additional data
  house?: string // house/floor/unit number
  contactPhone?: string // contact number

  contactName?: string // contact name
}

export default V2Address