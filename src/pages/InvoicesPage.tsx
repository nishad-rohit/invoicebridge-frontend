import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import { useInvoices } from '../features/invoices/hooks/useInvoices'
import { formatDate, formatEnumLabel, formatMoney } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

export default function InvoicesPage() {
  const invoicesQuery = useInvoices()
  const customersQuery = useCustomers()

  const customerNameById = new Map(
    (customersQuery.data ?? []).map((customer) => [customer.id, customer.name]),
  )

  const invoices = invoicesQuery.data ?? []

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create and manage invoices for your company."
        actions={
          <Link
            to="/invoices/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Invoice
          </Link>
        }
      />

      {invoicesQuery.isLoading ? <LoadingState label="Loading invoices…" /> : null}

      {invoicesQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(invoicesQuery.error)}
          onRetry={() => void invoicesQuery.refetch()}
        />
      ) : null}

      {invoicesQuery.isSuccess && invoices.length === 0 ? (
        <EmptyState
          title="No invoices yet."
          description="Create your first invoice to begin the e-invoicing workflow."
          action={
            <Link
              to="/invoices/new"
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create Invoice
            </Link>
          }
        />
      ) : null}

      {invoicesQuery.isSuccess && invoices.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Invoice Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Currency</th>
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
                      <p className="text-xs text-slate-500">
                        {formatEnumLabel(String(invoice.documentType))}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {customerNameById.get(invoice.customerId) ??
                        invoice.customerId}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(invoice.issueDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {formatMoney(invoice.totalAmount, invoice.currency)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{invoice.currency}</td>
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
