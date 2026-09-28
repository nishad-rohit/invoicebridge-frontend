import api from '../../../api/axios'
import type {
  CreateInvoiceRequest,
  Invoice,
  UpdateInvoiceRequest,
} from '../types'
import type { InvoiceReadiness } from '../../validation/types'

export async function getInvoices(): Promise<Invoice[]> {
  const { data } = await api.get<Invoice[]>('/api/v1/invoices')
  return data
}

export async function getInvoice(id: string): Promise<Invoice> {
  const { data } = await api.get<Invoice>(`/api/v1/invoices/${id}`)
  return data
}

export async function createInvoice(
  payload: CreateInvoiceRequest,
): Promise<Invoice> {
  const { data } = await api.post<Invoice>('/api/v1/invoices', payload)
  return data
}

export async function updateInvoice(
  id: string,
  payload: UpdateInvoiceRequest,
): Promise<Invoice> {
  const { data } = await api.put<Invoice>(`/api/v1/invoices/${id}`, payload)
  return data
}

export async function getInvoiceReadiness(
  invoiceId: string,
): Promise<InvoiceReadiness> {
  const { data } = await api.get<InvoiceReadiness>(
    `/api/v1/invoices/${invoiceId}/readiness`,
  )
  return data
}
