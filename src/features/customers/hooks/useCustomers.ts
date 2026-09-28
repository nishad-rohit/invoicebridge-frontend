import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as customerApi from '../api/customerApi'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types'

export const customerKeys = {
  all: ['customers'] as const,
  detail: (id: string) => ['customers', id] as const,
}

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: customerApi.getCustomers,
  })
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? ''),
    queryFn: () => customerApi.getCustomer(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCustomerRequest) =>
      customerApi.createCustomer(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customerKeys.all })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCustomerRequest
    }) => customerApi.updateCustomer(id, payload),
    onSuccess: async (customer) => {
      await queryClient.invalidateQueries({ queryKey: customerKeys.all })
      await queryClient.invalidateQueries({
        queryKey: customerKeys.detail(customer.id),
      })
    },
  })
}

export function useDeactivateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customerApi.deactivateCustomer(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: customerKeys.all })
      await queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) })
    },
  })
}
