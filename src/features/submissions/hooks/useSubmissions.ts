import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { invoiceKeys } from '../../invoices/hooks/useInvoices'
import * as submissionApi from '../api/submissionApi'

export const submissionKeys = {
  byInvoice: (invoiceId: string) =>
    ['invoices', invoiceId, 'submissions'] as const,
  events: (submissionId: string) =>
    ['submissions', submissionId, 'events'] as const,
}

export function useInvoiceSubmissions(invoiceId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.byInvoice(invoiceId ?? ''),
    queryFn: () => submissionApi.getInvoiceSubmissions(invoiceId!),
    enabled: Boolean(invoiceId),
  })
}

export function useSubmissionEvents(submissionId: string | undefined) {
  return useQuery({
    queryKey: submissionKeys.events(submissionId ?? ''),
    queryFn: () => submissionApi.getSubmissionEvents(submissionId!),
    enabled: Boolean(submissionId),
  })
}

export function useSubmitInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invoiceId: string) => submissionApi.submitInvoice(invoiceId),
    onSuccess: async (_data, invoiceId) => {
      await queryClient.invalidateQueries({
        queryKey: submissionKeys.byInvoice(invoiceId),
      })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(invoiceId),
      })
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
  })
}

export function useAcceptSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      submissionId,
    }: {
      submissionId: string
      invoiceId: string
    }) => submissionApi.acceptSubmission(submissionId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: submissionKeys.byInvoice(variables.invoiceId),
      })
      await queryClient.invalidateQueries({
        queryKey: submissionKeys.events(variables.submissionId),
      })
      await queryClient.invalidateQueries({
        queryKey: invoiceKeys.detail(variables.invoiceId),
      })
      await queryClient.invalidateQueries({ queryKey: invoiceKeys.all })
    },
  })
}
