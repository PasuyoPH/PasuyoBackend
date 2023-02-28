interface V2HttpUser {
  email?: string
  phone?: string

  fullName?: string
  pin?: string

  referral?: string
}

interface V2HttpUserData {
  user: V2HttpUser
  rider: boolean
}

export {
  V2HttpUser,
  V2HttpUserData
}