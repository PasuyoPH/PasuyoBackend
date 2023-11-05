interface Geo {
  latitude?: number
  longitude?: number
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
  merchant?: boolean // setting this to true, would mark this as a merchant address. meaning the user field would instead be the id of the merchant who owns this address
}

export default Address
export { Geo }