interface HttpUser {
  email?: string
  phone?: string

  fullName?: string
  pin?: string

  referral?: string
}

interface HttpUserData {
  user: HttpUser
  rider: boolean
}

export {
  HttpUser,
  HttpUserData
}