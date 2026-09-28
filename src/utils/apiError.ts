import axios from 'axios'

/**
 * Maps Axios/network failures to short, user-facing messages.
 * Does not surface stack traces or raw backend internals.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return 'Unable to reach the server. Please check your connection and try again.'
      }
      return 'The server is currently unavailable. Please try again later.'
    }

    const status = error.response.status
    const body = error.response.data
    const backendMessage =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message.trim()
        : null

    const safeBackendMessage =
      backendMessage &&
      !/exception|stack|hibernate|sql|jdbc|null pointer/i.test(backendMessage)
        ? backendMessage
        : null

    switch (status) {
      case 400:
        return safeBackendMessage ?? 'Invalid request. Please check your details and try again.'
      case 401:
        return safeBackendMessage ?? 'Your session has expired. Please sign in again.'
      case 403:
        return safeBackendMessage ?? 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 409:
        return safeBackendMessage ?? 'This action conflicts with the current state of the resource.'
      case 422:
        return safeBackendMessage ?? 'The submitted data could not be processed.'
      case 500:
      case 502:
      case 503:
        return 'Something went wrong. Please try again.'
      default:
        return safeBackendMessage ?? 'Something went wrong. Please try again.'
    }
  }

  return 'Something went wrong. Please try again.'
}
