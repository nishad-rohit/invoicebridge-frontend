import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Send, ShieldCheck } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useToast } from '../components/feedback/ToastProvider'
import { useCustomer } from '../features/customers/hooks/useCustomers'
import { useInvoice } from '../features/invoices/hooks/useInvoices'
import {
  canEditInvoice,
  canSubmitInvoice,
} from '../features/invoices/types'
import {
  useInvoiceSubmissions,
  useSubmitInvoice,
} from '../features/submissions/hooks/useSubmissions'
import {
  useInvoiceValidations,
  useValidateInvoice,
} from '../features/validation/hooks/useValidation'
import { formatDate, formatDateTime, formatEnumLabel, formatMoney } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const invoiceQuery = useInvoice(id)
  const customerQuery = useCustomer(invoiceQuery.data?.customerId)
  const validationsQuery = useInvoiceValidations(id)
  const submissionsQuery = useInvoiceSubmissions(id)
  const validateInvoice = useValidateInvoice()
  const submitInvoice = useSubmitInvoice()
  const [actionError, setActionError] = useState<string | null>(null)

  if (invoiceQuery.isLoading) {
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

  const invoice = invoiceQuery.data
  const editable = canEditInvoice(String(invoice.status))
  const submittable = canSubmitInvoice(String(invoice.status))

  async function handleValidate() {
    if (!id) return
    setActionError(null)
    try {
      const result = await validateInvoice.mutateAsync(id)
      toast.success(
        result.valid
          ? 'Invoice validated successfully.'
          : 'Validation completed with issues.',
      )
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    }
  }

  async function handleSubmit() {
    if (!id) return
    setActionError(null)
    try {
      await submitInvoice.mutateAsync(id)
      toast.success('Invoice submitted successfully.')
    } catch (error) {
      setActionError(getApiErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/invoices"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to invoices
        </Link>

        <PageHeader
          title={invoice.invoiceNumber}
          description={`${formatEnumLabel(String(invoice.documentType))} · ${
            customerQuery.data?.name ?? 'Customer'
          }`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={invoice.status} />
              {editable ? (
                <button
                  type="button"
                  onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void handleValidate()}
                disabled={validateInvoice.isPending}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {validateInvoice.isPending ? 'Validating…' : 'Validate'}
              </button>
              {submittable ? (
                <button
                  type="button"
                  onClick={() => void handleSubmit()}
                  disabled={submitInvoice.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {submitInvoice.isPending ? 'Submitting…' : 'Submit'}
                </button>
              ) : null}
            </div>
          }
        />
      </div>

      {actionError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {actionError}
        </div>
      ) : null}

      <Section title="Invoice Information">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Issue Date</dt>
            <dd className="mt-1 text-sm text-slate-900">{formatDate(invoice.issueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Due Date</dt>
            <dd className="mt-1 text-sm text-slate-900">{formatDate(invoice.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Currency</dt>
            <dd className="mt-1 text-sm text-slate-900">{invoice.currency}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Payment Means</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatEnumLabel(
                invoice.paymentMeansType ? String(invoice.paymentMeansType) : null,
              )}
            </dd>
          </div>
          {invoice.notes ? (
            <div className="sm:col-span-2 lg:col-span-4">
              <dt className="text-xs font-medium text-slate-500 uppercase">Notes</dt>
              <dd className="mt-1 text-sm text-slate-900">{invoice.notes}</dd>
            </div>
          ) : null}
        </dl>
      </Section>

      <Section title="Customer">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Name</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {customerQuery.data ? (
                <Link
                  to={`/customers/${customerQuery.data.id}`}
                  className="hover:underline"
                >
                  {customerQuery.data.name}
                </Link>
              ) : (
                invoice.customerId
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">TRN</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {customerQuery.data?.trn || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Email</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {customerQuery.data?.email || '—'}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Invoice Lines">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Unit Price</th>
                <th className="px-3 py-2">Tax %</th>
                <th className="px-3 py-2">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-2 text-slate-500">{item.lineNumber}</td>
                  <td className="px-3 py-2 text-slate-900">
                    <div>{item.description}</div>
                    {item.itemName ? (
                      <div className="text-xs text-slate-500">{item.itemName}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">{String(item.quantity)}</td>
                  <td className="px-3 py-2">
                    {formatMoney(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-3 py-2">{String(item.taxRate)}</td>
                  <td className="px-3 py-2">
                    {formatMoney(item.lineTotal, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Totals">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Subtotal</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatMoney(invoice.subtotal, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Tax</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatMoney(invoice.taxAmount, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Total</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">
              {formatMoney(invoice.totalAmount, invoice.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Amount Due</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatMoney(invoice.amountDue, invoice.currency)}
            </dd>
          </div>
        </dl>
      </Section>

      {(invoice.paymentInstructions?.length || invoice.paymentTerms?.length) ? (
        <Section title="Payment Information">
          <div className="space-y-3 text-sm text-slate-700">
            {invoice.paymentInstructions?.map((instruction) => (
              <div key={instruction.id} className="rounded-md bg-slate-50 p-3">
                <p>
                  Means code: <strong>{instruction.paymentMeansCode}</strong>
                </p>
                {instruction.paymentMeansText ? (
                  <p>{instruction.paymentMeansText}</p>
                ) : null}
              </div>
            ))}
            {invoice.paymentTerms?.map((term) => (
              <div key={term.id} className="rounded-md bg-slate-50 p-3">
                {term.termsText || '—'}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Validation History">
        {validationsQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading validations…</p>
        ) : validationsQuery.isError ? (
          <p className="text-sm text-red-600">
            {getApiErrorMessage(validationsQuery.error)}
          </p>
        ) : (validationsQuery.data?.length ?? 0) === 0 ? (
          <p className="text-sm text-slate-500">No validation runs yet.</p>
        ) : (
          <div className="space-y-3">
            {validationsQuery.data?.map((run) => (
              <div
                key={run.validationRunId}
                className="rounded-md border border-slate-100 p-3"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={run.status} />
                  <span className="text-xs text-slate-500">
                    {run.errorCount} errors · {run.warningCount} warnings
                  </span>
                </div>
                {run.issues.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {run.issues.map((issue, index) => (
                      <li key={`${run.validationRunId}-${index}`} className="text-slate-700">
                        <span className="font-medium">{issue.severity}</span>
                        {issue.code ? ` [${issue.code}]` : ''}: {issue.message}
                        {issue.fieldName ? (
                          <span className="text-slate-500"> ({issue.fieldName})</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">No issues reported.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Submissions">
        {submissionsQuery.isLoading ? (
          <p className="text-sm text-slate-500">Loading submissions…</p>
        ) : submissionsQuery.isError ? (
          <p className="text-sm text-red-600">
            {getApiErrorMessage(submissionsQuery.error)}
          </p>
        ) : (submissionsQuery.data?.length ?? 0) === 0 ? (
          <p className="text-sm text-slate-500">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="px-3 py-2">Attempt</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">External ID</th>
                  <th className="px-3 py-2">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissionsQuery.data?.map((submission) => (
                  <tr key={submission.submissionId}>
                    <td className="px-3 py-2">{submission.attemptNumber}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-3 py-2">
                      {submission.externalSubmissionId || '—'}
                    </td>
                    <td className="px-3 py-2">
                      {formatDateTime(submission.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}
