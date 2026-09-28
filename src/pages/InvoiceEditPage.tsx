import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import { useToast } from '../components/feedback/ToastProvider'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import InvoiceForm from '../features/invoices/components/InvoiceForm'
import {
  useInvoice,
  useUpdateInvoice,
} from '../features/invoices/hooks/useInvoices'
import {
  canEditInvoice,
  type UpdateInvoiceRequest,
} from '../features/invoices/types'
import { getApiErrorMessage } from '../utils/apiError'

export default function InvoiceEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const invoiceQuery = useInvoice(id)
  const customersQuery = useCustomers()
  const updateInvoice = useUpdateInvoice()
  const [error, setError] = useState<string | null>(null)

  if (invoiceQuery.isLoading || customersQuery.isLoading) {
    return <LoadingState label="Loading invoice…" />
  }

  if (invoiceQuery.isError || !invoiceQuery.data) {
    return (
      <ErrorState
        message={getApiErrorMessage(invoiceQuery.error)}
        onRetry={() => void invoiceQuery.refetch()}
      />
    )
  }

  if (!canEditInvoice(String(invoiceQuery.data.status))) {
    return <Navigate to={`/invoices/${invoiceQuery.data.id}`} replace />
  }

  async function handleSubmit(payload: UpdateInvoiceRequest) {
    if (!id) return
    setError(null)
    try {
      await updateInvoice.mutateAsync({ id, payload })
      toast.success('Invoice updated successfully.')
      navigate(`/invoices/${id}`, { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/invoices/${id}`}
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to invoice
        </Link>
      </div>

      <PageHeader
        title={`Edit ${invoiceQuery.data.invoiceNumber}`}
        description="Only DRAFT, VALIDATION_FAILED, or REJECTED invoices can be updated."
      />

      <InvoiceForm
        mode="edit"
        customers={customersQuery.data ?? []}
        initialInvoice={invoiceQuery.data}
        busy={updateInvoice.isPending}
        error={error}
        onSubmitUpdate={handleSubmit}
        onCancel={() => navigate(`/invoices/${id}`)}
      />
    </div>
  )
}
