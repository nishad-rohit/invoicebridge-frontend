import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import { useInvoices } from '../features/invoices/hooks/useInvoices'
import { formatDate, formatMoney } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

const VALIDATION_RELATED = new Set([
  'VALIDATION_FAILED',
  'VALIDATED',
  'SUBMITTED',
  'ACCEPTED',
  'REJECTED',
])

export default function ValidationsPage() {
  const invoicesQuery = useInvoices()
  const customersQuery = useCustomers()

  const customerNameById = new Map(
    (customersQuery.data ?? []).map((customer) => [customer.id, customer.name]),
  )

  const invoices = (invoicesQuery.data ?? []).filter((invoice) =>
    VALIDATION_RELATED.has(String(invoice.status)),
  )

  return (
    <div>
      <PageHeader
        title="Validations"
        description="Monitor invoice validation results. Validation history is available on each invoice detail page."
      />

      {invoicesQuery.isLoading ? (
        <LoadingState label="Loading validation overview…" />
      ) : null}

      {invoicesQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(invoicesQuery.error)}
          onRetry={() => void invoicesQuery.refetch()}
        />
      ) : null}

      {invoicesQuery.isSuccess && invoices.length === 0 ? (
        <EmptyState
          title="No validation runs yet."
          description="Validate an invoice from its detail page to see results here."
        />
      ) : null}

      {invoicesQuery.isSuccess && invoices.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {customerNameById.get(invoice.customerId) ??
                        invoice.customerId}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="px-4 py-3">
                      {formatMoney(invoice.totalAmount, invoice.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
