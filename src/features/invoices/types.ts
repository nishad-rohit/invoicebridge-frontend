export type InvoiceStatus =
  | 'DRAFT'
  | 'VALIDATION_FAILED'
  | 'VALIDATED'
  | 'SUBMITTED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'

export type DocumentType = 'TAX_INVOICE' | 'CREDIT_NOTE' | 'DEBIT_NOTE'

export type PaymentMeansType =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'CARD'
  | 'DIRECT_DEBIT'
  | 'OTHER'

export interface InvoiceItemAdjustmentRequest {
  chargeIndicator: boolean
  amount: number | string
  baseAmount?: number | string | null
  percentage?: number | string | null
  reason?: string | null
  reasonCode?: string | null
}

export interface InvoiceItemRequest {
  description: string
  itemName?: string | null
  quantity: number | string
  unitOfMeasureCode?: string | null
  unitPrice: number | string
  itemGrossPrice?: number | string | null
  itemPriceBaseQuantity?: number | string | null
  taxCategoryCode?: string | null
  taxRate: number | string
  adjustments?: InvoiceItemAdjustmentRequest[] | null
}

export interface InvoiceDocumentAdjustmentRequest {
  chargeIndicator: boolean
  amount: number | string
  baseAmount?: number | string | null
  percentage?: number | string | null
  reason?: string | null
  reasonCode?: string | null
  taxCategoryCode?: string | null
  taxSchemeCode?: string | null
  taxRate?: number | string | null
}

export interface InvoicePaymentCreditTransferRequest {
  paymentAccountIdentifier: string
  paymentAccountSchemeIdentifier?: string | null
  paymentAccountName?: string | null
  paymentServiceProviderIdentifier?: string | null
}

export interface InvoicePaymentCardRequest {
  primaryAccountNumber: string
  cardHolderName?: string | null
}

export interface InvoicePaymentDirectDebitRequest {
  mandateReferenceIdentifier?: string | null
  creditorIdentifier?: string | null
  debitedAccountIdentifier?: string | null
}

export interface InvoicePaymentInstructionRequest {
  instructionIdentifier?: string | null
  paymentMeansCode: string
  paymentMeansText?: string | null
  remittanceInformation?: string[] | null
  creditTransfer?: InvoicePaymentCreditTransferRequest | null
  card?: InvoicePaymentCardRequest | null
  directDebit?: InvoicePaymentDirectDebitRequest | null
}

export interface InvoicePaymentTermRequest {
  paymentInstructionIdentifier?: string | null
  termsText?: string | null
  termsAmount?: number | string | null
  installmentDueDate?: string | null
}

export interface InvoiceDeliveryInformationRequest {
  actualDeliveryDate?: string | null
  deliverToPartyName?: string | null
  deliveryLocationIdentifier?: string | null
  deliveryLocationSchemeIdentifier?: string | null
  incoterms?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  addressLine3?: string | null
  city?: string | null
  postCode?: string | null
  countrySubdivision?: string | null
  countryCode?: string | null
  invoicingPeriodStartDate?: string | null
  invoicingPeriodEndDate?: string | null
  billingFrequencyCode?: string | null
}

export interface InvoicePrecedingReferenceRequest {
  precedingInvoiceReference: string
  precedingInvoiceIssueDate?: string | null
}

export interface CreateInvoiceRequest {
  customerId: string
  invoiceNumber: string
  documentType: DocumentType
  issueDate: string
  dueDate?: string | null
  currency: string
  taxAccountingCurrency?: string | null
  exchangeRate?: number | string | null
  businessProcessType?: string | null
  specificationIdentifier?: string | null
  transactionTypeCode?: string | null
  creditNoteReasonCode?: string | null
  paymentMeansType?: PaymentMeansType | null
  notes?: string | null
  items: InvoiceItemRequest[]
  documentAdjustments?: InvoiceDocumentAdjustmentRequest[] | null
  paymentInstructions?: InvoicePaymentInstructionRequest[] | null
  paymentTerms?: InvoicePaymentTermRequest[] | null
  deliveryInformation?: InvoiceDeliveryInformationRequest | null
  precedingInvoiceReferences?: InvoicePrecedingReferenceRequest[] | null
}

export interface UpdateInvoiceRequest {
  issueDate: string
  dueDate?: string | null
  currency?: string | null
  taxAccountingCurrency?: string | null
  exchangeRate?: number | string | null
  businessProcessType?: string | null
  specificationIdentifier?: string | null
  transactionTypeCode?: string | null
  creditNoteReasonCode?: string | null
  paymentMeansType?: PaymentMeansType | null
  notes?: string | null
  items: InvoiceItemRequest[]
  documentAdjustments?: InvoiceDocumentAdjustmentRequest[] | null
  paymentInstructions?: InvoicePaymentInstructionRequest[] | null
  paymentTerms?: InvoicePaymentTermRequest[] | null
  deliveryInformation?: InvoiceDeliveryInformationRequest | null
  precedingInvoiceReferences?: InvoicePrecedingReferenceRequest[] | null
}

export interface InvoiceItemAdjustment {
  id: string
  chargeIndicator: boolean
  amount: number | string
  baseAmount: number | string | null
  percentage: number | string | null
  reason: string | null
  reasonCode: string | null
}

export interface InvoiceItem {
  id: string
  lineNumber: number
  itemName: string | null
  description: string
  quantity: number | string
  unitOfMeasureCode: string | null
  unitPrice: number | string
  itemGrossPrice: number | string | null
  itemPriceBaseQuantity: number | string | null
  taxCategoryCode: string | null
  taxRate: number | string
  lineSubtotal: number | string
  taxAmount: number | string
  lineTotal: number | string
  vatLineAmountAed: number | string | null
  lineAmountAed: number | string | null
  adjustments: InvoiceItemAdjustment[] | null
}

export interface InvoiceTaxBreakdown {
  id: string
  taxableAmount: number | string
  taxAmount: number | string
  taxCategoryCode: string | null
  taxSchemeCode: string | null
  taxRate: number | string | null
}

export interface InvoiceDocumentAdjustment {
  id: string
  chargeIndicator: boolean
  amount: number | string
  baseAmount: number | string | null
  percentage: number | string | null
  reason: string | null
  reasonCode: string | null
  taxCategoryCode: string | null
  taxSchemeCode: string | null
  taxRate: number | string | null
}

export interface InvoicePaymentCreditTransfer {
  id: string
  paymentAccountIdentifier: string
  paymentAccountSchemeIdentifier: string | null
  paymentAccountName: string | null
  paymentServiceProviderIdentifier: string | null
}

export interface InvoicePaymentCard {
  id: string
  primaryAccountNumber: string
  cardHolderName: string | null
}

export interface InvoicePaymentDirectDebit {
  id: string
  mandateReferenceIdentifier: string | null
  creditorIdentifier: string | null
  debitedAccountIdentifier: string | null
}

export interface InvoicePaymentInstruction {
  id: string
  instructionIdentifier: string | null
  paymentMeansCode: string
  paymentMeansText: string | null
  remittanceInformation: string[] | null
  creditTransfer: InvoicePaymentCreditTransfer | null
  card: InvoicePaymentCard | null
  directDebit: InvoicePaymentDirectDebit | null
}

export interface InvoicePaymentTerm {
  id: string
  paymentInstructionIdentifier: string | null
  termsText: string | null
  termsAmount: number | string | null
  installmentDueDate: string | null
}

export interface InvoiceDeliveryInformation {
  id: string
  actualDeliveryDate: string | null
  deliverToPartyName: string | null
  deliveryLocationIdentifier: string | null
  deliveryLocationSchemeIdentifier: string | null
  incoterms: string | null
  addressLine1: string | null
  addressLine2: string | null
  addressLine3: string | null
  city: string | null
  postCode: string | null
  countrySubdivision: string | null
  countryCode: string | null
  invoicingPeriodStartDate: string | null
  invoicingPeriodEndDate: string | null
  billingFrequencyCode: string | null
}

export interface InvoicePrecedingReference {
  id: string
  precedingInvoiceReference: string
  precedingInvoiceIssueDate: string | null
}

export interface Invoice {
  id: string
  customerId: string
  invoiceNumber: string
  documentType: DocumentType | string
  issueDate: string
  dueDate: string | null
  currency: string
  taxAccountingCurrency: string | null
  exchangeRate: number | string | null
  businessProcessType: string | null
  specificationIdentifier: string | null
  transactionTypeCode: string | null
  creditNoteReasonCode: string | null
  paymentMeansType: PaymentMeansType | string | null
  subtotal: number | string
  allowanceTotal: number | string | null
  chargeTotal: number | string | null
  taxExclusiveAmount: number | string | null
  taxAmount: number | string
  taxAmountAccountingCurrency: number | string | null
  totalAmount: number | string
  amountDue: number | string | null
  status: InvoiceStatus | string
  notes: string | null
  items: InvoiceItem[]
  taxBreakdowns: InvoiceTaxBreakdown[] | null
  documentAdjustments: InvoiceDocumentAdjustment[] | null
  paymentInstructions: InvoicePaymentInstruction[] | null
  paymentTerms: InvoicePaymentTerm[] | null
  deliveryInformation: InvoiceDeliveryInformation | null
  precedingInvoiceReferences: InvoicePrecedingReference[] | null
}

export const EDITABLE_INVOICE_STATUSES: InvoiceStatus[] = [
  'DRAFT',
  'VALIDATION_FAILED',
  'REJECTED',
]

export function canEditInvoice(status: string): boolean {
  return EDITABLE_INVOICE_STATUSES.includes(status as InvoiceStatus)
}

export function canSubmitInvoice(status: string): boolean {
  return status === 'VALIDATED'
}
