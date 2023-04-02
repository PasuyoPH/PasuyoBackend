interface V2HttpAddressData {
  latitude: number
  longitude: number
  formattedAddress: string
  name: string
  note: string

  // optional data
  house?: string
  contactName?: string

  contactPhone?: string
}

export default V2HttpAddressData