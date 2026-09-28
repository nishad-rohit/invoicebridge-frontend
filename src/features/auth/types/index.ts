/**
 * Mirrors backend LoginRequest
 * (com.invoicebridgeuae.auth.dto.LoginRequest)
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Mirrors backend LoginResponse
 * (com.invoicebridgeuae.auth.dto.LoginResponse)
 */
export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  userId: string
  companyId: string
  email: string
  role: string
}

/**
 * Mirrors backend AuthenticatedUser returned by GET /api/v1/profile
 * (com.invoicebridgeuae.auth.security.AuthenticatedUser)
 */
export interface AuthenticatedUser {
  userId: string
  companyId: string
  email: string
  role: string
}
