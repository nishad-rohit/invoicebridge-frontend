import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as aspApi from '../api/aspApi'
import type { CreateAspConnectionRequest } from '../types'

export const aspKeys = {
  providers: ['asp', 'providers'] as const,
  connections: ['asp', 'connections'] as const,
}

export function useAspProviders() {
  return useQuery({
    queryKey: aspKeys.providers,
    queryFn: aspApi.getAspProviders,
  })
}

export function useAspConnections() {
  return useQuery({
    queryKey: aspKeys.connections,
    queryFn: aspApi.getAspConnections,
  })
}

export function useCreateAspConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAspConnectionRequest) =>
      aspApi.createAspConnection(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aspKeys.connections })
    },
  })
}

export function useConnectAspConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => aspApi.connectAspConnection(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: aspKeys.connections })
    },
  })
}
