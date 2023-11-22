class ApiError extends Error {
  constructor(msg, status, url, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
    this.name = 'ApiError'
    this.msg = msg
    this.status = status
    this.url = url
  }
}

export default ApiError
