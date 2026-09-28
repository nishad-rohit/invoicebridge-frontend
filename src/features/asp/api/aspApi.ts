import api from '../../../api/axios'
import type {
  AspConnection,
  AspProvider,
  CreateAspConnectionRequest,
} from '../types'

export async function getAspProviders(): Promise<AspProvider[]> {
  const { data } = await api.get<AspProvider[]>('/api/v1/asp/providers')
  return data
}

export async function getAspConnections(): Promise<AspConnection[]> {
  const { data } = await api.get<AspConnection[]>('/api/v1/asp/connections')
  return data
}

export async function createAspConnection(
  payload: CreateAspConnectionRequest,
): Promise<AspConnection> {
  const { data } = await api.post<AspConnection>(
    '/api/v1/asp/connections',
    payload,
  )
  return data
}

export async function connectAspConnection(
  id: string,
): Promise<AspConnection> {
  const { data } = await api.patch<AspConnection>(
    `/api/v1/asp/connections/${id}/connect`,
  )
  return data
}
