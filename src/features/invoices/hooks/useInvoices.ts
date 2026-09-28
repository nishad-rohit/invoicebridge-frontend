import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as invoiceApi from '../api/invoiceApi'
import type { CreateInvoiceRequest, UpdateInvoiceRequest } from '../types'

export const invoiceKeys = {
  all: ['invoices'] as const,
  detail: (id: string) => ['invoices', id] as const,
  readiness: (id: string) => ['invoices', id, 'readiness'] as const,
}

export function useInvoices() {
  return useQuery({
    queryKey: invoiceKeys.all,
    queryFn: invoiceApi.getInvoices,
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: invoiceKeys.detail(id ?? ''),
    queryFn: () => invoiceApi.getInvoice(id!),
    enabled: Boolean(id),
  })
}

export function useInvoiceReadiness(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: invoiceKeys.readiness(id ?? ''),
    queryFn: () => invoiceApi.getInvoiceReadiness(id!),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInvoiceRequest) =>
      invoiceApi.createInvoice(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateInvoiceRequest
    }) => invoiceApi.updateInvoice(id, payload),
    onSuccess: async (invoice) => {
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(invoice.id),
      })
    },
  })
}
