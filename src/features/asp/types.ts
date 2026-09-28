export type AspProviderStatus = 'ACTIVE' | 'INACTIVE'
export type AspConnectionStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERROR'
  | 'DISABLED'
export type AspEnvironment = 'SANDBOX' | 'PRODUCTION'

export interface AspProvider {
  id: string
  code: string
  name: string
  apiBaseUrl: string | null
  status: AspProviderStatus | string
}

export interface AspConnection {
  id: string
  aspProviderId: string
  providerCode: string
  providerName: string
  environment: AspEnvironment | string
  status: AspConnectionStatus | string
  externalAccountId: string | null
  connectedAt: string | null
}

export interface CreateAspConnectionRequest {
  aspProviderId: string
  environment: AspEnvironment | string
  externalAccountId?: string | null
  credentialsReference?: string | null
}
