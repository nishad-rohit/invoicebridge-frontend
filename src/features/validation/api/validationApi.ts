import api from '../../../api/axios'
import type { InvoiceValidation } from '../types'

export async function validateInvoice(
  invoiceId: string,
): Promise<InvoiceValidation> {
  const { data } = await api.post<InvoiceValidation>(
    `/api/v1/invoices/${invoiceId}/validate`,
  )
  return data
}

export async function getInvoiceValidations(
  invoiceId: string,
): Promise<InvoiceValidation[]> {
  const { data } = await api.get<InvoiceValidation[]>(
    `/api/v1/invoices/${invoiceId}/validations`,
  )
  return data
}
