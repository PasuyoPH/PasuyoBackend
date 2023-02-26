// HTTP Error class that extends the default error class, to make throwing/handling errors easier.
class HttpError extends Error {
  public isBackendError = true

  constructor(
    public code: number,
    public message: string
  ) {
    super(message)
    
    this.name = 'HTTPError'
  }
}

export default HttpError