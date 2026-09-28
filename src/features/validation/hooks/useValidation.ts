import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoiceKeys } from '../../invoices/hooks/useInvoices'
import * as validationApi from '../api/validationApi'

export const validationKeys = {
  history: (invoiceId: string) =>
    ['invoices', invoiceId, 'validations'] as const,
}

export function useInvoiceValidations(invoiceId: string | undefined) {
  return useQuery({
    queryKey: validationKeys.history(invoiceId ?? ''),
    queryFn: () => validationApi.getInvoiceValidations(invoiceId!),
    enabled: Boolean(invoiceId),
  })
}

export function useValidateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invoiceId: string) => validationApi.validateInvoice(invoiceId),
    onSuccess: async (_data, invoiceId) => {
      await queryClient.invalidateQueries({
        queryKey: validationKeys.history(invoiceId),
      })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(invoiceId),
      })
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.readiness(invoiceId),
      })
    },
  })
}
