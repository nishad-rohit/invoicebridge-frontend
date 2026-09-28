import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useCustomer } from '../features/customers/hooks/useCustomers'
import { getApiErrorMessage } from '../utils/apiError'

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{value || '—'}</dd>
    </div>
  )
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const customerQuery = useCustomer(id)

  if (customerQuery.isLoading) {
    return <LoadingState label="Loading customer…" />
  }

  if (customerQuery.isError || !customerQuery.data) {
    return (
      <ErrorState
        message={getApiErrorMessage(customerQuery.error)}
        onRetry={() => void customerQuery.refetch()}
      />
    )
  }

  const customer = customerQuery.data

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/customers"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to customers
        </Link>
      </div>

      <PageHeader
        title={customer.name}
        description={`Customer code ${customer.customerCode}`}
        actions={<StatusBadge status={customer.status} />}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Legal Name" value={customer.legalName} />
          <DetailItem label="TRN" value={customer.trn} />
          <DetailItem label="TIN" value={customer.tin} />
          <DetailItem label="Email" value={customer.email} />
          <DetailItem label="Phone" value={customer.phone} />
          <DetailItem label="Tax Scheme Code" value={customer.taxSchemeCode} />
          <DetailItem label="Electronic Address" value={customer.electronicAddress} />
          <DetailItem
            label="Electronic Identifier"
            value={customer.electronicIdentifier}
          />
          <DetailItem label="City" value={customer.city} />
          <DetailItem label="Emirate" value={customer.emirate} />
        </dl>
      </div>
    </div>
  )
}
