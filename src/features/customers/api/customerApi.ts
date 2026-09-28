import api from '../../../api/axios'
import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
} from '../types'

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>('/api/v1/customers')
  return data
}

export async function getCustomer(id: string): Promise<Customer> {
  const { data } = await api.get<Customer>(`/api/v1/customers/${id}`)
  return data
}

export async function createCustomer(
  payload: CreateCustomerRequest,
): Promise<Customer> {
  const { data } = await api.post<Customer>('/api/v1/customers', payload)
  return data
}

export async function updateCustomer(
  id: string,
  payload: UpdateCustomerRequest,
): Promise<Customer> {
  const { data } = await api.put<Customer>(`/api/v1/customers/${id}`, payload)
  return data
}

export async function deactivateCustomer(id: string): Promise<void> {
  await api.patch(`/api/v1/customers/${id}/deactivate`)
}
