import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  emptyToUndefined,
  FormField,
  inputClassName,
} from '../../../components/common/Modal'
import type { Customer } from '../../customers/types'
import type {
  CreateInvoiceRequest,
  DocumentType,
  Invoice,
  InvoiceItemRequest,
  PaymentMeansType,
  UpdateInvoiceRequest,
} from '../types'

interface LineState {
  description: string
  itemName: string
  quantity: string
  unitOfMeasureCode: string
  unitPrice: string
  taxCategoryCode: string
  taxRate: string
}

interface InvoiceFormProps {
  mode: 'create' | 'edit'
  customers: Customer[]
  initialInvoice?: Invoice
  busy?: boolean
  error?: string | null
  onSubmitCreate?: (payload: CreateInvoiceRequest) => Promise<void>
  onSubmitUpdate?: (payload: UpdateInvoiceRequest) => Promise<void>
  onCancel: () => void
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyLine(): LineState {
  return {
    description: '',
    itemName: '',
    quantity: '1',
    unitOfMeasureCode: 'EA',
    unitPrice: '',
    taxCategoryCode: 'S',
    taxRate: '5',
  }
}

function linesFromInvoice(invoice?: Invoice): LineState[] {
  if (!invoice?.items?.length) {
    return [emptyLine()]
  }
  return invoice.items.map((item) => ({
    description: item.description ?? '',
    itemName: item.itemName ?? '',
    quantity: String(item.quantity ?? ''),
    unitOfMeasureCode: item.unitOfMeasureCode ?? '',
    unitPrice: String(item.unitPrice ?? ''),
    taxCategoryCode: item.taxCategoryCode ?? '',
    taxRate: String(item.taxRate ?? ''),
  }))
}

export default function InvoiceForm({
  mode,
  customers,
  initialInvoice,
  busy = false,
  error,
  onSubmitCreate,
  onSubmitUpdate,
  onCancel,
}: InvoiceFormProps) {
  const activeCustomers = customers.filter((c) => c.status === 'ACTIVE')

  const [customerId, setCustomerId] = useState(initialInvoice?.customerId ?? '')
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialInvoice?.invoiceNumber ?? '',
  )
  const [documentType, setDocumentType] = useState<DocumentType>(
    (initialInvoice?.documentType as DocumentType) || 'TAX_INVOICE',
  )
  const [issueDate, setIssueDate] = useState(
    initialInvoice?.issueDate ?? todayIso(),
  )
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate ?? '')
  const [currency, setCurrency] = useState(initialInvoice?.currency ?? 'AED')
  const [paymentMeansType, setPaymentMeansType] = useState<PaymentMeansType | ''>(
    (initialInvoice?.paymentMeansType as PaymentMeansType) || '',
  )
  const [notes, setNotes] = useState(initialInvoice?.notes ?? '')
  const [paymentMeansCode, setPaymentMeansCode] = useState(
    initialInvoice?.paymentInstructions?.[0]?.paymentMeansCode ?? '',
  )
  const [paymentMeansText, setPaymentMeansText] = useState(
    initialInvoice?.paymentInstructions?.[0]?.paymentMeansText ?? '',
  )
  const [termsText, setTermsText] = useState(
    initialInvoice?.paymentTerms?.[0]?.termsText ?? '',
  )
  const [lines, setLines] = useState<LineState[]>(linesFromInvoice(initialInvoice))
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function updateLine(index: number, patch: Partial<LineState>) {
    setLines((current) =>
      current.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    )
  }

  function buildItems(): InvoiceItemRequest[] {
    return lines.map((line) => ({
      description: line.description.trim(),
      itemName: emptyToUndefined(line.itemName),
      quantity: line.quantity,
      unitOfMeasureCode: emptyToUndefined(line.unitOfMeasureCode),
      unitPrice: line.unitPrice,
      taxCategoryCode: emptyToUndefined(line.taxCategoryCode),
      taxRate: line.taxRate,
    }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (mode === 'create' && !customerId) {
      next.customerId = 'Customer is required.'
    }
    if (mode === 'create' && !invoiceNumber.trim()) {
      next.invoiceNumber = 'Invoice number is required.'
    }
    if (!issueDate) {
      next.issueDate = 'Issue date is required.'
    }
    if (!currency.trim()) {
      next.currency = 'Currency is required.'
    }
    if (lines.length === 0) {
      next.items = 'At least one invoice line is required.'
    }
    lines.forEach((line, index) => {
      if (!line.description.trim()) {
        next[`line-${index}-description`] = 'Description is required.'
      }
      if (!line.quantity || Number(line.quantity) <= 0) {
        next[`line-${index}-quantity`] = 'Quantity must be greater than 0.'
      }
      if (line.unitPrice === '' || Number(line.unitPrice) < 0) {
        next[`line-${index}-unitPrice`] = 'Unit price is required.'
      }
      if (line.taxRate === '' || Number(line.taxRate) < 0) {
        next[`line-${index}-taxRate`] = 'Tax rate is required.'
      }
    })
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) {
      return
    }

    const items = buildItems()
    const paymentInstructions = paymentMeansCode.trim()
      ? [
          {
            paymentMeansCode: paymentMeansCode.trim(),
            paymentMeansText: emptyToUndefined(paymentMeansText),
          },
        ]
      : undefined
    const paymentTerms = termsText.trim()
      ? [{ termsText: termsText.trim() }]
      : undefined

    if (mode === 'create' && onSubmitCreate) {
      const payload: CreateInvoiceRequest = {
        customerId,
        invoiceNumber: invoiceNumber.trim(),
        documentType,
        issueDate,
        dueDate: emptyToUndefined(dueDate) ?? null,
        currency: currency.trim(),
        paymentMeansType: paymentMeansType || null,
        notes: emptyToUndefined(notes) ?? null,
        items,
        paymentInstructions,
        paymentTerms,
      }
      await onSubmitCreate(payload)
      return
    }

    if (mode === 'edit' && onSubmitUpdate) {
      const payload: UpdateInvoiceRequest = {
        issueDate,
        dueDate: emptyToUndefined(dueDate) ?? null,
        currency: currency.trim(),
        paymentMeansType: paymentMeansType || null,
        notes: emptyToUndefined(notes) ?? null,
        items,
        paymentInstructions,
        paymentTerms,
      }
      await onSubmitUpdate(payload)
    }
  }

  return (
    <form className="space-y-6" onSubmit={(e) => void handleSubmit(e)} noValidate>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Invoice Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === 'create' ? (
            <FormField
              label="Customer"
              htmlFor="customerId"
              required
              error={fieldErrors.customerId}
            >
              <select
                id="customerId"
                className={inputClassName}
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                disabled={busy}
              >
                <option value="">Select customer</option>
                {activeCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.customerCode})
                  </option>
                ))}
              </select>
            </FormField>
          ) : (
            <FormField label="Customer" htmlFor="customerReadonly">
              <input
                id="customerReadonly"
                className={inputClassName}
                value={
                  customers.find((c) => c.id === initialInvoice?.customerId)?.name ??
                  initialInvoice?.customerId ??
                  ''
                }
                disabled
              />
            </FormField>
          )}

          {mode === 'create' ? (
            <FormField
              label="Invoice Number"
              htmlFor="invoiceNumber"
              required
              error={fieldErrors.invoiceNumber}
            >
              <input
                id="invoiceNumber"
                className={inputClassName}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                disabled={busy}
              />
            </FormField>
          ) : (
            <FormField label="Invoice Number" htmlFor="invoiceNumberReadonly">
              <input
                id="invoiceNumberReadonly"
                className={inputClassName}
                value={invoiceNumber}
                disabled
              />
            </FormField>
          )}

          {mode === 'create' ? (
            <FormField label="Document Type" htmlFor="documentType" required>
              <select
                id="documentType"
                className={inputClassName}
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value as DocumentType)
                }
                disabled={busy}
              >
                <option value="TAX_INVOICE">Tax Invoice</option>
                <option value="CREDIT_NOTE">Credit Note</option>
                <option value="DEBIT_NOTE">Debit Note</option>
              </select>
            </FormField>
          ) : (
            <FormField label="Document Type" htmlFor="documentTypeReadonly">
              <input
                id="documentTypeReadonly"
                className={inputClassName}
                value={documentType}
                disabled
              />
            </FormField>
          )}

          <FormField
            label="Currency"
            htmlFor="currency"
            required
            error={fieldErrors.currency}
          >
            <input
              id="currency"
              className={inputClassName}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={busy}
            />
          </FormField>

          <FormField
            label="Issue Date"
            htmlFor="issueDate"
            required
            error={fieldErrors.issueDate}
          >
            <input
              id="issueDate"
              type="date"
              className={inputClassName}
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              disabled={busy}
            />
          </FormField>

          <FormField label="Due Date" htmlFor="dueDate">
            <input
              id="dueDate"
              type="date"
              className={inputClassName}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={busy}
            />
          </FormField>

          <FormField label="Payment Means Type" htmlFor="paymentMeansType">
            <select
              id="paymentMeansType"
              className={inputClassName}
              value={paymentMeansType}
              onChange={(e) =>
                setPaymentMeansType(e.target.value as PaymentMeansType | '')
              }
              disabled={busy}
            >
              <option value="">Not specified</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CARD">Card</option>
              <option value="DIRECT_DEBIT">Direct Debit</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>

          <FormField label="Notes" htmlFor="notes">
            <input
              id="notes"
              className={inputClassName}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={busy}
            />
          </FormField>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Invoice Lines</h2>
          <button
            type="button"
            onClick={() => setLines((current) => [...current, emptyLine()])}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Line
          </button>
        </div>
        {fieldErrors.items ? (
          <p className="mb-3 text-sm text-red-600">{fieldErrors.items}</p>
        ) : null}
        <div className="space-y-4">
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-md border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2 lg:grid-cols-6"
            >
              <div className="sm:col-span-2 lg:col-span-2">
                <FormField
                  label="Description"
                  htmlFor={`desc-${index}`}
                  required
                  error={fieldErrors[`line-${index}-description`]}
                >
                  <input
                    id={`desc-${index}`}
                    className={inputClassName}
                    value={line.description}
                    onChange={(e) =>
                      updateLine(index, { description: e.target.value })
                    }
                    disabled={busy}
                  />
                </FormField>
              </div>
              <FormField label="Item Name" htmlFor={`item-${index}`}>
                <input
                  id={`item-${index}`}
                  className={inputClassName}
                  value={line.itemName}
                  onChange={(e) => updateLine(index, { itemName: e.target.value })}
                  disabled={busy}
                />
              </FormField>
              <FormField
                label="Qty"
                htmlFor={`qty-${index}`}
                required
                error={fieldErrors[`line-${index}-quantity`]}
              >
                <input
                  id={`qty-${index}`}
                  type="number"
                  min="0.0001"
                  step="any"
                  className={inputClassName}
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: e.target.value })}
                  disabled={busy}
                />
              </FormField>
              <FormField
                label="Unit Price"
                htmlFor={`price-${index}`}
                required
                error={fieldErrors[`line-${index}-unitPrice`]}
              >
                <input
                  id={`price-${index}`}
                  type="number"
                  min="0"
                  step="any"
                  className={inputClassName}
                  value={line.unitPrice}
                  onChange={(e) =>
                    updateLine(index, { unitPrice: e.target.value })
                  }
                  disabled={busy}
                />
              </FormField>
              <FormField
                label="Tax Rate %"
                htmlFor={`tax-${index}`}
                required
                error={fieldErrors[`line-${index}-taxRate`]}
              >
                <input
                  id={`tax-${index}`}
                  type="number"
                  min="0"
                  step="any"
                  className={inputClassName}
                  value={line.taxRate}
                  onChange={(e) => updateLine(index, { taxRate: e.target.value })}
                  disabled={busy}
                />
              </FormField>
              <FormField label="UOM" htmlFor={`uom-${index}`}>
                <input
                  id={`uom-${index}`}
                  className={inputClassName}
                  value={line.unitOfMeasureCode}
                  onChange={(e) =>
                    updateLine(index, { unitOfMeasureCode: e.target.value })
                  }
                  disabled={busy}
                />
              </FormField>
              <FormField label="Tax Category" htmlFor={`cat-${index}`}>
                <input
                  id={`cat-${index}`}
                  className={inputClassName}
                  value={line.taxCategoryCode}
                  onChange={(e) =>
                    updateLine(index, { taxCategoryCode: e.target.value })
                  }
                  disabled={busy}
                />
              </FormField>
              <div className="flex items-end">
                <button
                  type="button"
                  disabled={busy || lines.length === 1}
                  onClick={() =>
                    setLines((current) => current.filter((_, i) => i !== index))
                  }
                  className="rounded-md p-2 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                  aria-label={`Remove line ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Payment Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Payment Means Code" htmlFor="paymentMeansCode">
            <input
              id="paymentMeansCode"
              className={inputClassName}
              value={paymentMeansCode}
              onChange={(e) => setPaymentMeansCode(e.target.value)}
              disabled={busy}
              placeholder="e.g. 30"
            />
          </FormField>
          <FormField label="Payment Means Text" htmlFor="paymentMeansText">
            <input
              id="paymentMeansText"
              className={inputClassName}
              value={paymentMeansText}
              onChange={(e) => setPaymentMeansText(e.target.value)}
              disabled={busy}
            />
          </FormField>
          <FormField label="Payment Terms" htmlFor="termsText">
            <input
              id="termsText"
              className={inputClassName}
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              disabled={busy}
            />
          </FormField>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Totals are calculated by the backend after save.
        </p>
      </section>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy
            ? 'Saving…'
            : mode === 'create'
              ? 'Save Invoice'
              : 'Update Invoice'}
        </button>
      </div>
    </form>
  )
}
