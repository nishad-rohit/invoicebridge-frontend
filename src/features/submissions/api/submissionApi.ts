import api from '../../../api/axios'
import type { InvoiceSubmission, SubmissionEvent } from '../types'

export async function submitInvoice(
  invoiceId: string,
): Promise<InvoiceSubmission> {
  const { data } = await api.post<InvoiceSubmission>(
    `/api/v1/invoices/${invoiceId}/submit`,
  )
  return data
}

export async function getInvoiceSubmissions(
  invoiceId: string,
): Promise<InvoiceSubmission[]> {
  const { data } = await api.get<InvoiceSubmission[]>(
    `/api/v1/invoices/${invoiceId}/submissions`,
  )
  return data
}

export async function acceptSubmission(
  submissionId: string,
): Promise<InvoiceSubmission> {
  const { data } = await api.post<InvoiceSubmission>(
    `/api/v1/invoices/submissions/${submissionId}/accept`,
  )
  return data
}

export async function getSubmissionEvents(
  submissionId: string,
): Promise<SubmissionEvent[]> {
  const { data } = await api.get<SubmissionEvent[]>(
    `/api/v1/submissions/${submissionId}/events`,
  )
  return data
}
