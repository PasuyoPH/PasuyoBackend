interface Geo {
  latitude: number
  longitude: number
}

interface Address extends Geo {
  uid: string
  user: string // user who created the address

  // Extra information
  text: string // Text form of the address
  template: string // Template name (Notes)
  landmark?: string // Landmark location

  // Contact Info
  contactPhone: string
  contactName: string

  createdAt: number
}

export default Address
export { Geo }