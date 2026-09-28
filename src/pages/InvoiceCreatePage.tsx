import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import { useToast } from '../components/feedback/ToastProvider'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import InvoiceForm from '../features/invoices/components/InvoiceForm'
import { useCreateInvoice } from '../features/invoices/hooks/useInvoices'
import type { CreateInvoiceRequest } from '../features/invoices/types'
import { getApiErrorMessage } from '../utils/apiError'

export default function InvoiceCreatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const customersQuery = useCustomers()
  const createInvoice = useCreateInvoice()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(payload: CreateInvoiceRequest) {
    setError(null)
    try {
      const invoice = await createInvoice.mutateAsync(payload)
      toast.success('Invoice created successfully.')
      navigate(`/invoices/${invoice.id}`, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  if (customersQuery.isLoading) {
    return <LoadingState label="Loading customers…" />
  }

  if (customersQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(customersQuery.error)}
        onRetry={() => void customersQuery.refetch()}
      />
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to invoices
        </Link>
      </div>

      <PageHeader
        title="Create Invoice"
        description="Enter invoice details and line items. Totals are calculated by the backend."
      />

      <InvoiceForm
        mode="create"
        customers={customersQuery.data ?? []}
        busy={createInvoice.isPending}
        error={error}
        onSubmitCreate={handleSubmit}
        onCancel={() => navigate('/invoices')}
      />
    </div>
  )
}
