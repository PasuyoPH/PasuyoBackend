interface UserTokenContent {
  uid: string
  pin: string
}

interface RiderTokenContent extends UserTokenContent {}

interface AdminTokenContent {
  uid: string
  password: string
}

export {
  UserTokenContent,
  RiderTokenContent,
  AdminTokenContent
}