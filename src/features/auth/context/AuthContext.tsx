import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getCurrentUser, login as loginRequest } from '../api/authApi'
import type { AuthenticatedUser, LoginRequest } from '../types'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '../utils/tokenStorage'

interface AuthContextValue {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clearAuthState = useCallback(() => {
    removeAccessToken()
    setUser(null)
    void queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const token = getAccessToken()

      if (!token) {
        if (!cancelled) {
          setUser(null)
          setIsLoading(false)
        }
        return
      }

      try {
        const profile = await getCurrentUser()
        if (!cancelled) {
          setUser(profile)
        }
      } catch {
        removeAccessToken()
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await loginRequest(credentials)
    setAccessToken(response.accessToken)

    try {
      const profile = await getCurrentUser()
      setUser(profile)
    } catch (error) {
      // Token was stored but profile validation failed — clear everything.
      removeAccessToken()
      setUser(null)
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthState()
  }, [clearAuthState])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
