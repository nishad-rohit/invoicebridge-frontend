import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  FileText,
  Send,
  ShieldAlert,
} from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useAuth } from '../features/auth/context/AuthContext'
import { useCustomers } from '../features/customers/hooks/useCustomers'
import { useInvoices } from '../features/invoices/hooks/useInvoices'
import { getUserDisplayName } from '../utils/userDisplay'
import { formatDate, formatMoney } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

interface MetricCardProps {
  label: string
  value: number
  icon: ReactNode
  to: string
}

function MetricCard({ label, value, icon, to }: MetricCardProps) {
  return (
    <Link
      to={to}
      className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className="rounded-md bg-slate-100 p-2 text-slate-700">{icon}</div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const customersQuery = useCustomers()
  const invoicesQuery = useInvoices()

  const loading = customersQuery.isLoading || invoicesQuery.isLoading
  const error = customersQuery.error || invoicesQuery.error

  const customers = customersQuery.data ?? []
  const invoices = invoicesQuery.data ?? []

  const validationIssues = invoices.filter(
    (invoice) => invoice.status === 'VALIDATION_FAILED',
  ).length
  const pendingSubmissions = invoices.filter(
    (invoice) => invoice.status === 'SUBMITTED' || invoice.status === 'VALIDATED',
  ).length

  const recentInvoices = [...invoices]
    .sort((a, b) => String(b.issueDate).localeCompare(String(a.issueDate)))
    .slice(0, 5)

  const customerNameById = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user ? getUserDisplayName(user) : 'User'}`}
      />

      {loading ? <LoadingState label="Loading dashboard…" /> : null}

      {error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => {
            void customersQuery.refetch()
            void invoicesQuery.refetch()
          }}
        />
      ) : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Customers"
              value={customers.length}
              to="/customers"
              icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
            />
            <MetricCard
              label="Total Invoices"
              value={invoices.length}
              to="/invoices"
              icon={<FileText className="h-5 w-5" aria-hidden="true" />}
            />
            <MetricCard
              label="Validation Issues"
              value={validationIssues}
              to="/validations"
              icon={<ShieldAlert className="h-5 w-5" aria-hidden="true" />}
            />
            <MetricCard
              label="Pending Submissions"
              value={pendingSubmissions}
              to="/submissions"
              icon={<Send className="h-5 w-5" aria-hidden="true" />}
            />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Invoices
              </h2>
              <Link
                to="/invoices"
                className="text-sm font-medium text-slate-700 hover:underline"
              >
                View all
              </Link>
            </div>
            {recentInvoices.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-500">
                No invoices yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-4 py-3">Invoice</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id}>
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
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
