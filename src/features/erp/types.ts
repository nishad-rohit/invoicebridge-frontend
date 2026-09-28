export type ErpIntegrationType =
  | 'SAP'
  | 'ORACLE'
  | 'MICROSOFT_DYNAMICS'
  | 'ZOHO'
  | 'QUICKBOOKS'
  | 'CUSTOM_API'

export type ErpIntegrationStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERROR'
  | 'DISABLED'

export type IntegrationSyncType = string
export type IntegrationSyncStatus = string

export interface ErpIntegration {
  id: string
  integrationType: ErpIntegrationType | string
  name: string
  status: ErpIntegrationStatus | string
  baseUrl: string | null
  configuration: string | null
  lastSyncAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateErpIntegrationRequest {
  integrationType: ErpIntegrationType
  name: string
  baseUrl?: string | null
  configuration?: string | null
}

export interface UpdateErpIntegrationRequest {
  name: string
  baseUrl?: string | null
  configuration?: string | null
}

export interface ErpIntegrationHealth {
  integrationId: string
  integrationName: string
  integrationStatus: ErpIntegrationStatus | string
  lastSuccessfulSyncAt: string | null
  lastSyncJobId: string | null
  lastSyncType: IntegrationSyncType | null
  lastSyncStatus: IntegrationSyncStatus | null
  lastSyncStartedAt: string | null
  lastSyncCompletedAt: string | null
  recordsFound: number | null
  recordsProcessed: number | null
  recordsSkipped: number | null
  recordsFailed: number | null
  lastError: string | null
}

export interface IntegrationSyncJob {
  id: string
  erpIntegrationId: string
  syncType: IntegrationSyncType
  status: IntegrationSyncStatus
  recordsFound: number | null
  recordsProcessed: number | null
  recordsSkipped: number | null
  recordsFailed: number | null
  startedAt: string | null
  completedAt: string | null
  errorMessage: string | null
  createdAt: string
}
