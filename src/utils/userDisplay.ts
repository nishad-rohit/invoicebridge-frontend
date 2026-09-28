import type { AuthenticatedUser } from '../features/auth/types'

/**
 * Display name from the real AuthenticatedUser shape.
 * Backend profile currently provides email (no firstName/lastName).
 */
export function getUserDisplayName(user: AuthenticatedUser): string {
  return user.email
}

/**
 * Initials from available user data.
 * Email local-part → first two alphanumeric characters (e.g. amit@… → AM).
 */
export function getUserInitials(user: AuthenticatedUser): string {
  const localPart = user.email.split('@')[0] ?? ''
  const cleaned = localPart.replace(/[^a-zA-Z0-9]/g, '')

  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2).toUpperCase()
  }

  if (cleaned.length === 1) {
    return `${cleaned}X`.toUpperCase()
  }

  return 'IB'
}
