import api from '../../../api/axios'
import type {
  CreateErpIntegrationRequest,
  ErpIntegration,
  ErpIntegrationHealth,
  IntegrationSyncJob,
  UpdateErpIntegrationRequest,
} from '../types'

export async function getErpIntegrations(): Promise<ErpIntegration[]> {
  const { data } = await api.get<ErpIntegration[]>('/api/v1/erp/integrations')
  return data
}

export async function getErpIntegration(id: string): Promise<ErpIntegration> {
  const { data } = await api.get<ErpIntegration>(
    `/api/v1/erp/integrations/${id}`,
  )
  return data
}

export async function createErpIntegration(
  payload: CreateErpIntegrationRequest,
): Promise<ErpIntegration> {
  const { data } = await api.post<ErpIntegration>(
    '/api/v1/erp/integrations',
    payload,
  )
  return data
}

export async function updateErpIntegration(
  id: string,
  payload: UpdateErpIntegrationRequest,
): Promise<ErpIntegration> {
  const { data } = await api.put<ErpIntegration>(
    `/api/v1/erp/integrations/${id}`,
    payload,
  )
  return data
}

export async function disableErpIntegration(
  id: string,
): Promise<ErpIntegration> {
  const { data } = await api.patch<ErpIntegration>(
    `/api/v1/erp/integrations/${id}/disable`,
  )
  return data
}

export async function testErpConnection(id: string): Promise<ErpIntegration> {
  const { data } = await api.post<ErpIntegration>(
    `/api/v1/erp/integrations/${id}/test-connection`,
  )
  return data
}

export async function syncErpIntegration(
  id: string,
): Promise<IntegrationSyncJob> {
  const { data } = await api.post<IntegrationSyncJob>(
    `/api/v1/erp/integrations/${id}/sync`,
  )
  return data
}

export async function getErpHealth(id: string): Promise<ErpIntegrationHealth> {
  const { data } = await api.get<ErpIntegrationHealth>(
    `/api/v1/erp/integrations/${id}/health`,
  )
  return data
}

export async function getErpSyncJobs(
  integrationId: string,
): Promise<IntegrationSyncJob[]> {
  const { data } = await api.get<IntegrationSyncJob[]>(
    `/api/v1/erp/integrations/${integrationId}/sync-jobs`,
  )
  return data
}
