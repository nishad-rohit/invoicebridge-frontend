import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Search, UserX } from 'lucide-react'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import Modal, {
  emptyToUndefined,
  FormField,
  inputClassName,
} from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useToast } from '../components/feedback/ToastProvider'
import {
  useCreateCustomer,
  useCustomers,
  useDeactivateCustomer,
  useUpdateCustomer,
} from '../features/customers/hooks/useCustomers'
import type {
  CreateCustomerRequest,
  Customer,
  UpdateCustomerRequest,
} from '../features/customers/types'
import { getApiErrorMessage } from '../utils/apiError'

interface CustomerFormState {
  customerCode: string
  name: string
  legalName: string
  trn: string
  tin: string
  electronicAddress: string
  electronicIdentifier: string
  taxSchemeCode: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  emirate: string
}

const emptyForm: CustomerFormState = {
  customerCode: '',
  name: '',
  legalName: '',
  trn: '',
  tin: '',
  electronicAddress: '',
  electronicIdentifier: '',
  taxSchemeCode: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  emirate: '',
}

function toFormState(customer?: Customer): CustomerFormState {
  if (!customer) {
    return emptyForm
  }

  return {
    customerCode: customer.customerCode ?? '',
    name: customer.name ?? '',
    legalName: customer.legalName ?? '',
    trn: customer.trn ?? '',
    tin: customer.tin ?? '',
    electronicAddress: customer.electronicAddress ?? '',
    electronicIdentifier: customer.electronicIdentifier ?? '',
    taxSchemeCode: customer.taxSchemeCode ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    addressLine1: '',
    addressLine2: '',
    city: customer.city ?? '',
    emirate: customer.emirate ?? '',
  }
}

export default function CustomersPage() {
  const toast = useToast()
  const customersQuery = useCustomers()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const deactivateCustomer = useDeactivateCustomer()

  const [search, setSearch] = useState('')
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [form, setForm] = useState<CustomerFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [deactivateTarget, setDeactivateTarget] = useState<Customer | null>(
    null,
  )

  const customers = customersQuery.data ?? []
  const filtered = customers.filter((customer) => {
    const q = search.trim().toLowerCase()
    if (!q) {
      return true
    }
    return [
      customer.name,
      customer.customerCode,
      customer.email,
      customer.trn,
      customer.legalName,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q))
  })

  function openCreate() {
    setSelected(null)
    setForm(emptyForm)
    setFieldErrors({})
    setFormError(null)
    setModalMode('create')
  }

  function openEdit(customer: Customer) {
    setSelected(customer)
    setForm(toFormState(customer))
    setFieldErrors({})
    setFormError(null)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setSelected(null)
    setFormError(null)
    setFieldErrors({})
  }

  function validateForm(isCreate: boolean): boolean {
    const next: Record<string, string> = {}
    if (isCreate && !form.customerCode.trim()) {
      next.customerCode = 'Customer code is required.'
    }
    if (!form.name.trim()) {
      next.name = 'Name is required.'
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const isCreate = modalMode === 'create'
    if (!validateForm(isCreate)) {
      return
    }

    setFormError(null)

    try {
      if (isCreate) {
        const payload: CreateCustomerRequest = {
          customerCode: form.customerCode.trim(),
          name: form.name.trim(),
          legalName: emptyToUndefined(form.legalName),
          trn: emptyToUndefined(form.trn),
          tin: emptyToUndefined(form.tin),
          electronicAddress: emptyToUndefined(form.electronicAddress),
          electronicIdentifier: emptyToUndefined(form.electronicIdentifier),
          taxSchemeCode: emptyToUndefined(form.taxSchemeCode),
          email: emptyToUndefined(form.email),
          phone: emptyToUndefined(form.phone),
          addressLine1: emptyToUndefined(form.addressLine1),
          addressLine2: emptyToUndefined(form.addressLine2),
          city: emptyToUndefined(form.city),
          emirate: emptyToUndefined(form.emirate),
        }
        await createCustomer.mutateAsync(payload)
        toast.success('Customer created successfully.')
      } else if (selected) {
        const payload: UpdateCustomerRequest = {
          name: form.name.trim(),
          legalName: emptyToUndefined(form.legalName),
          trn: emptyToUndefined(form.trn),
          tin: emptyToUndefined(form.tin),
          electronicAddress: emptyToUndefined(form.electronicAddress),
          electronicIdentifier: emptyToUndefined(form.electronicIdentifier),
          taxSchemeCode: emptyToUndefined(form.taxSchemeCode),
          email: emptyToUndefined(form.email),
          phone: emptyToUndefined(form.phone),
          addressLine1: emptyToUndefined(form.addressLine1),
          addressLine2: emptyToUndefined(form.addressLine2),
          city: emptyToUndefined(form.city),
          emirate: emptyToUndefined(form.emirate),
        }
        await updateCustomer.mutateAsync({ id: selected.id, payload })
        toast.success('Customer updated successfully.')
      }
      closeModal()
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) {
      return
    }
    try {
      await deactivateCustomer.mutateAsync(deactivateTarget.id)
      toast.success('Customer deactivated.')
      setDeactivateTarget(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const busy = createCustomer.isPending || updateCustomer.isPending

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage customers associated with your company."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Customer
          </button>
        }
      />

      <div className="mb-4">
        <label className="relative block max-w-md">
          <span className="sr-only">Search customers</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, code, email or TRN"
            className={`${inputClassName} pl-10`}
          />
        </label>
      </div>

      {customersQuery.isLoading ? <LoadingState label="Loading customers…" /> : null}

      {customersQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(customersQuery.error)}
          onRetry={() => void customersQuery.refetch()}
        />
      ) : null}

      {customersQuery.isSuccess && customers.length === 0 ? (
        <EmptyState
          title="No customers yet."
          description="Add your first customer to start creating invoices."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Customer
            </button>
          }
        />
      ) : null}

      {customersQuery.isSuccess && customers.length > 0 && filtered.length === 0 ? (
        <EmptyState
          title="No matching customers."
          description="Try a different search term."
        />
      ) : null}

      {customersQuery.isSuccess && filtered.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">TRN</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {customer.name}
                      </Link>
                      <p className="text-xs text-slate-500">{customer.customerCode}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{customer.trn || '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{customer.email || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(customer)}
                          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
                          aria-label={`Edit ${customer.name}`}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {customer.status !== 'INACTIVE' ? (
                          <button
                            type="button"
                            onClick={() => setDeactivateTarget(customer)}
                            className="rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                            aria-label={`Deactivate ${customer.name}`}
                            title="Deactivate"
                          >
                            <UserX className="h-4 w-4" aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <Modal
        open={modalMode !== null}
        title={modalMode === 'create' ? 'Add Customer' : 'Edit Customer'}
        onClose={closeModal}
        wide
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {modalMode === 'create' ? (
              <FormField
                label="Customer Code"
                htmlFor="customerCode"
                required
                error={fieldErrors.customerCode}
              >
                <input
                  id="customerCode"
                  className={inputClassName}
                  value={form.customerCode}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      customerCode: e.target.value,
                    }))
                  }
                  disabled={busy}
                />
              </FormField>
            ) : (
              <FormField label="Customer Code" htmlFor="customerCodeReadonly">
                <input
                  id="customerCodeReadonly"
                  className={inputClassName}
                  value={form.customerCode}
                  disabled
                />
              </FormField>
            )}
            <FormField label="Name" htmlFor="name" required error={fieldErrors.name}>
              <input
                id="name"
                className={inputClassName}
                value={form.name}
                onChange={(e) =>
                  setForm((current) => ({ ...current, name: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Legal Name" htmlFor="legalName">
              <input
                id="legalName"
                className={inputClassName}
                value={form.legalName}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    legalName: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="TRN" htmlFor="trn">
              <input
                id="trn"
                className={inputClassName}
                value={form.trn}
                onChange={(e) =>
                  setForm((current) => ({ ...current, trn: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="TIN" htmlFor="tin">
              <input
                id="tin"
                className={inputClassName}
                value={form.tin}
                onChange={(e) =>
                  setForm((current) => ({ ...current, tin: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Tax Scheme Code" htmlFor="taxSchemeCode">
              <input
                id="taxSchemeCode"
                className={inputClassName}
                value={form.taxSchemeCode}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    taxSchemeCode: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
              <input
                id="email"
                type="email"
                className={inputClassName}
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({ ...current, email: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <input
                id="phone"
                className={inputClassName}
                value={form.phone}
                onChange={(e) =>
                  setForm((current) => ({ ...current, phone: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Electronic Address" htmlFor="electronicAddress">
              <input
                id="electronicAddress"
                className={inputClassName}
                value={form.electronicAddress}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    electronicAddress: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField
              label="Electronic Identifier"
              htmlFor="electronicIdentifier"
            >
              <input
                id="electronicIdentifier"
                className={inputClassName}
                value={form.electronicIdentifier}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    electronicIdentifier: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Address Line 1" htmlFor="addressLine1">
              <input
                id="addressLine1"
                className={inputClassName}
                value={form.addressLine1}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    addressLine1: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Address Line 2" htmlFor="addressLine2">
              <input
                id="addressLine2"
                className={inputClassName}
                value={form.addressLine2}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    addressLine2: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="City" htmlFor="city">
              <input
                id="city"
                className={inputClassName}
                value={form.city}
                onChange={(e) =>
                  setForm((current) => ({ ...current, city: e.target.value }))
                }
                disabled={busy}
              />
            </FormField>
            <FormField label="Emirate" htmlFor="emirate">
              <input
                id="emirate"
                className={inputClassName}
                value={form.emirate}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    emirate: e.target.value,
                  }))
                }
                disabled={busy}
              />
            </FormField>
          </div>

          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {formError}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={closeModal}
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
              {busy ? 'Saving…' : modalMode === 'create' ? 'Create Customer' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deactivateTarget !== null}
        title="Deactivate this customer?"
        description="This customer will no longer be available for new invoices."
        confirmLabel="Deactivate Customer"
        tone="danger"
        busy={deactivateCustomer.isPending}
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={() => void handleDeactivate()}
      />
    </div>
  )
}
