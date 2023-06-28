interface PathReturnObject {
  error?: boolean
  code?: number

  message?: string
  value?: any

  willPipe?: boolean
  userTokenInvalid?: boolean
}

interface CustomError {
  msg: string
  code: number
}

export {
  PathReturnObject,
  CustomError
}