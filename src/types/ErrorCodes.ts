enum HttpErrorCodes {
  // General Error
  INVALID_FIELDS = 900,

  // Auth Related error codes
  AUTH_DUPL                 = 1000,
  AUTH_FAILED               = 1001,
  AUTH_INVALID_PIN          = 1002,
  AUTH_INVALID_NAME         = 1003,
  AUTH_INVALID_TKN          = 1004,
  AUTH_INVALID_EMAIL        = 1005,
  AUTH_REFERRAL_NOT_EXIST   = 1006,
  AUTH_PHONE_INVALID_LENGTH = 1007,

  // Delivery Related error codes
  DELIVERY_MISSING_DATA = 2000,
  DELIVERY_INVALID_ITEM = 2001,

  // Rider related codes
  RIDER_NOT_VERIFIED       = 3000,
  USER_NOT_RIDER           = 3001,
  RIDER_UPDATE_GEO_INVALID = 3002,

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
  JOB_NOT_EXIST                 = 5009,
  JOB_USER_MISMATCH             = 5010,
  JOB_INVALID_POINT_AMOUNT      = 5011,
  JOB_NO_ITEMS_FOR_ORDER        = 5012,
  JOB_MERCHANT_MISMATCH         = 5013,
  JOB_MERCHANT_CANT_LOCATE      = 5014,
  JOB_ADDRESS_CANT_BE_SAME      = 5015,

  // Token related codes
  TOKEN_INVALID_ROLE = 6000,

  // Address related codes
  ADDRESS_INVALID_GEOLOCATION       = 7000,
  ADDRESS_INVALID_FORMATTED_ADDRESS = 7001,
  ADDRESS_INVALID_CONTACT_NAME      = 7002,
  ADDRESS_IVNALID_CONTACT_PHONE     = 7003,
  ADDRESS_INVALID_NOTE              = 7004,
  ADDRESS_CANT_DELETE               = 7005,
  ADDRESS_USED_BY_JOB               = 7006,
  ADDRESS_INVALID_TEXT              = 7007,

  // Distance
  DISTANCE_INVALID_POINTS = 8000,
  DISTANCE_MUST_BE_FLOAT  = 8001,
  DISTANCE_CANT_FIND_PATH = 8002,

  // File related?
  JOB_NO_IMAGE_FILE_PROVIDED = 9000,
  FILE_UPLOAD_NO_BUCKET      = 9001,

  // Update job
  JOB_UPDATE_INVALID_STATUS = 10000,
  JOB_UPDATE_FAILED         = 10001,  

  // Admin only error codes
  ADMIN_INVALID_USER_ID      = 11000,
  ADMIN_INVALID_ACCOUNT      = 11001,
  ADMIN_USERNAME_EXISTS      = 11002,
  ADMIN_INVALID_TOKEN        = 11003,
  ADMIN_INVALID_PERMISSIONS  = 11004,
  ADMIN_LOAD_REQUEST_INVALID = 11005,

  // user-specifc
  USER_USE_SELF_ID_ONLY = 12000,

  // orders
  ORDER_NOT_FOUND = 13000,
  
  // paypal
  PAYPAL_NO_ACCESS_TOKEN        = 14000,
  PAYPAL_FAILED_TO_GET_APPROVED = 14001,
  PAYPAL_NO_TRANSACTION_EXISTS  = 14002,
  PAYPAL_ALREADY_PAID           = 14003,
  PAYPAL_PAYMENT_FAILED         = 14004,
  PAYPAL_NO_JOB_DATA_FOUND      = 14006,

  GEOCODE_FAILED            = 15000,
  GEOCODE_ADDRESS_NOT_FOUND = 15001,

  // payment
  PAYMENT_NO_JOB_DATA_FOUND      = 16000, // use this instead of paypal_no_job_data_found,
  PAYMENT_INVALID_JOB_TYPE       = 16001,
  PAYMENT_INVALID_PAYMENT_METHOD = 16002,
  PAYMENT_DISABLED               = 16003,
  PAYMENT_INVALID_RECEIPT_GCASH  = 16004,

  // likes
  LIKE_ITEM_NOT_EXIST = 17000,

  // New Job codes
  JOB2_RIDER_NO_JOB  = 18000,
  JOB2_ORDER_PENDING = 18001,

  // load request codes
  LOAD_TOO_LOW = 19000,

  // merchant accounts
  MERCHANT_INVALID_ACCOUNT     = 20000,
  MERCHANT_INVALID_UPDATE_DATA = 20001,
  MERCHANT_INVALID_NAME        = 20002,
  MERCHANT_INVALID_PRICE       = 20003,
  MERCHANT_INVALID_IMAGES      = 20004,
}

export default HttpErrorCodes