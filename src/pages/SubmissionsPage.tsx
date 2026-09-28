import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { getInvoiceSubmissions } from '../features/submissions/api/submissionApi'
import { submissionKeys } from '../features/submissions/hooks/useSubmissions'
import type { InvoiceSubmission } from '../features/submissions/types'
import { useInvoices } from '../features/invoices/hooks/useInvoices'
import { formatDateTime } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

const SUBMISSION_RELATED = new Set([
  'SUBMITTED',
  'ACCEPTED',
  'REJECTED',
  'VALIDATED',
])

export default function SubmissionsPage() {
  const invoicesQuery = useInvoices()

  const candidateInvoices = (invoicesQuery.data ?? []).filter((invoice) =>
    SUBMISSION_RELATED.has(String(invoice.status)),
  )

  const submissionQueries = useQueries({
    queries: candidateInvoices.map((invoice) => ({
      queryKey: submissionKeys.byInvoice(invoice.id),
      queryFn: () => getInvoiceSubmissions(invoice.id),
      enabled: invoicesQuery.isSuccess,
    })),
  })

  const loadingSubmissions =
    invoicesQuery.isSuccess &&
    submissionQueries.some((query) => query.isLoading || query.isFetching)

  const submissions: Array<InvoiceSubmission & { invoiceNumber: string }> = []
  candidateInvoices.forEach((invoice, index) => {
    const result = submissionQueries[index]
    if (result?.data) {
      result.data.forEach((submission) => {
        submissions.push({
          ...submission,
          invoiceNumber: invoice.invoiceNumber,
        })
      })
    }
  })

  submissions.sort((a, b) => {
    const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
    const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
    return bTime - aTime
  })

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Track e-invoice submissions. There is no global submissions list API; this page aggregates submissions for relevant invoices."
      />

      {invoicesQuery.isLoading || loadingSubmissions ? (
        <LoadingState label="Loading submissions…" />
      ) : null}

      {invoicesQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(invoicesQuery.error)}
          onRetry={() => void invoicesQuery.refetch()}
        />
      ) : null}

      {invoicesQuery.isSuccess &&
      !loadingSubmissions &&
      submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet."
          description="Submit a validated invoice from its detail page to see submissions here."
        />
      ) : null}

      {invoicesQuery.isSuccess &&
      !loadingSubmissions &&
      submissions.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Attempt</th>
                  <th className="px-4 py-3">External ID</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((submission) => (
                  <tr key={submission.submissionId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <Link
                        to={`/invoices/${submission.invoiceId}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {submission.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {submission.attemptNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {submission.externalSubmissionId || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDateTime(submission.submittedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={submission.status} />
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
