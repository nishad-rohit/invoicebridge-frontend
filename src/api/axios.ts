import axios from 'axios'
import { getAccessToken } from '../features/auth/utils/tokenStorage'

const api = axios.create({
  // Empty in local dev → same-origin requests, proxied by Vite to Spring Boot.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
