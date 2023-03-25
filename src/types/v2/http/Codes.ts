enum V2HttpErrorCodes {
  // General Error
  INVALID_FIELDS = 900,

  // Auth Related error codes
  AUTH_DUPL          = 1000,
  AUTH_FAILED        = 1001,
  AUTH_INVALID_PIN   = 1002,
  AUTH_INVALID_NAME  = 1003,
  AUTH_INVALID_TKN   = 1004,
  AUTH_INVALID_EMAIL = 1005,

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
  JOB_INVALID_TYPE              = 5000,
  JOB_INVALID_POINTS            = 5001,
  JOB_POINTS_NOT_EXIST          = 5002,
  JOB_INVALID_DELIVERY          = 5003,
  JOB_RIDER_HAS_JOB             = 5004,
  JOB_FAILED_TO_ACCEPT          = 5005,
  JOB_ALREADY_ACCEPTED          = 5006,
  JOB_NO_CREDITS_OR_NOT_OFFLINE = 5007,
  JOB_IS_DRAFT                  = 5008,

  // Token related codes
  TOKEN_INVALID_ROLE = 6000,

  // Address related codes
  ADDRESS_INVALID_GEOLOCATION       = 7000,
  ADDRESS_INVALID_FORMATTED_ADDRESS = 7001,
  ADDRESS_INVALID_CONTACT_NAME      = 7002,
  ADDRESS_IVNALID_CONTACT_PHONE     = 7003,

  // Distance
  DISTANCE_INVALID_POINTS = 8000,
  DISTANCE_MUST_BE_FLOAT  = 8001,

  // File related?
  JOB_NO_IMAGE_FILE_PROVIDED = 9000,
}

export default V2HttpErrorCodes