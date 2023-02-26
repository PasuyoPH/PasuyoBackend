// token data type
interface ITokenData {
  uid: string
  pin: string

  role: 'CUSTOMER' | 'RIDER' | 'ADMIN'
}

enum ITokenType {
  INVALID,
  CUSTOMER,
  RIDER
}

export {
  ITokenType,
  ITokenData
}