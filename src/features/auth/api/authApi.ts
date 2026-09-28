import api from '../../../api/axios'
import type { AuthenticatedUser, LoginRequest, LoginResponse } from '../types'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/v1/auth/login', payload)
  return data
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  const { data } = await api.get<AuthenticatedUser>('/api/v1/profile')
  return data
}
