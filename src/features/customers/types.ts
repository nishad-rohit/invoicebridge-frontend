export type CustomerStatus = 'ACTIVE' | 'INACTIVE'

export interface Customer {
  id: string
  customerCode: string
  name: string
  legalName: string | null
  trn: string | null
  tin: string | null
  electronicAddress: string | null
  electronicIdentifier: string | null
  taxSchemeCode: string | null
  email: string | null
  phone: string | null
  city: string | null
  emirate: string | null
  status: CustomerStatus | string
}

export interface CreateCustomerRequest {
  customerCode: string
  name: string
  legalName?: string | null
  trn?: string | null
  tin?: string | null
  electronicAddress?: string | null
  electronicIdentifier?: string | null
  taxSchemeCode?: string | null
  email?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  emirate?: string | null
}

export interface UpdateCustomerRequest {
  name: string
  legalName?: string | null
  trn?: string | null
  tin?: string | null
  electronicAddress?: string | null
  electronicIdentifier?: string | null
  taxSchemeCode?: string | null
  email?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  emirate?: string | null
}
