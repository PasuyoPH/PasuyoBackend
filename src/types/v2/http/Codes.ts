enum V2HttpErrorCodes {
  // General Error
  INVALID_FIELDS = 900,

  // Auth Related error codes
  AUTH_DUPL          = 1000,
  AUTH_FAILED        = 1001,
  AUTH_INVALID_PIN   = 1002,
  AUTH_INVALID_TKN   = 1003,
  AUTH_INVALID_EMAIL = 1004,

  // Delivery Related error codes
  DELIVERY_MISSING_DATA = 2000,
  DELIVERY_INVALID_ITEM = 2001,

  // Rider related codes
  RIDER_NOT_VERIFIED = 3000,
  USER_NOT_RIDER     = 3001,

  // Rating related codes
  RATING_RATE_INVALID        = 4000,
  RATING_COMMENT_TOO_SHORT   = 4001,
  RATING_COMMENT_TOO_LONG    = 4002,
  RATING_RIDER_CUSTOMER_ONLY = 4003,
  RATING_RIDER_NOT_EXIST     = 4004,

  // Job related codes
  JOB_INVALID_TYPE           = 5000,

  // Token related codes
  TOKEN_INVALID_ROLE = 6000,

  // Address related codes
  ADDRESS_INVALID_GEOLOCATION       = 7000,
  ADDRESS_INVALID_FORMATTED_ADDRESS = 7001,
  ADDRESS_INVALID_CONTACT_NAME      = 7002,
  ADDRESS_IVNALID_CONTACT_PHONE     = 7003,
}

export default V2HttpErrorCodes