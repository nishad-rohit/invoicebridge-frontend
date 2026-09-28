import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as erpApi from '../api/erpApi'
import type {
  CreateErpIntegrationRequest,
  UpdateErpIntegrationRequest,
} from '../types'

export const erpKeys = {
  all: ['erp', 'integrations'] as const,
  detail: (id: string) => ['erp', 'integrations', id] as const,
  health: (id: string) => ['erp', 'integrations', id, 'health'] as const,
  syncJobs: (id: string) => ['erp', 'integrations', id, 'sync-jobs'] as const,
}

export function useErpIntegrations() {
  return useQuery({
    queryKey: erpKeys.all,
    queryFn: erpApi.getErpIntegrations,
  })
}

export function useErpIntegration(id: string | undefined) {
  return useQuery({
    queryKey: erpKeys.detail(id ?? ''),
    queryFn: () => erpApi.getErpIntegration(id!),
    enabled: Boolean(id),
  })
}

export function useCreateErpIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateErpIntegrationRequest) =>
      erpApi.createErpIntegration(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: erpKeys.all })
    },
  })
}

export function useUpdateErpIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateErpIntegrationRequest
    }) => erpApi.updateErpIntegration(id, payload),
    onSuccess: async (integration) => {
      await queryClient.invalidateQueries({ queryKey: erpKeys.all })
      await queryClient.invalidateQueries({
        queryKey: erpKeys.detail(integration.id),
      })
    },
  })
}

export function useDisableErpIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => erpApi.disableErpIntegration(id),
    onSuccess: async (integration) => {
      await queryClient.invalidateQueries({ queryKey: erpKeys.all })
      await queryClient.invalidateQueries({
        queryKey: erpKeys.detail(integration.id),
      })
    },
  })
}

export function useTestErpConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => erpApi.testErpConnection(id),
    onSuccess: async (integration) => {
      await queryClient.invalidateQueries({ queryKey: erpKeys.all })
      await queryClient.invalidateQueries({
        queryKey: erpKeys.detail(integration.id),
      })
      await queryClient.invalidateQueries({
        queryKey: erpKeys.health(integration.id),
      })
    },
  })
}

export function useSyncErpIntegration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => erpApi.syncErpIntegration(id),
    onSuccess: async (_job, id) => {
      await queryClient.invalidateQueries({ queryKey: erpKeys.all })
      await queryClient.invalidateQueries({ queryKey: erpKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: erpKeys.syncJobs(id) })
      await queryClient.invalidateQueries({ queryKey: erpKeys.health(id) })
    },
  })
}
