import type { ReactNode } from 'react'

interface StatusBadgeProps {
  status: string | null | undefined
  className?: string
}

const TONE_BY_STATUS: Record<string, string> = {
  // Customer / generic
  ACTIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  INACTIVE: 'bg-slate-100 text-slate-700 ring-slate-500/20',

  // Invoice
  DRAFT: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  VALIDATION_FAILED: 'bg-red-50 text-red-800 ring-red-600/20',
  VALIDATED: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  SUBMITTED: 'bg-blue-50 text-blue-800 ring-blue-600/20',
  ACCEPTED: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  REJECTED: 'bg-red-50 text-red-800 ring-red-600/20',
  CANCELLED: 'bg-slate-100 text-slate-600 ring-slate-500/20',

  // Validation run
  PASSED: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  FAILED: 'bg-red-50 text-red-800 ring-red-600/20',

  // Submission
  PENDING: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  SUBMITTING: 'bg-blue-50 text-blue-800 ring-blue-600/20',

  // ASP / ERP connection
  DISCONNECTED: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  CONNECTING: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  CONNECTED: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  ERROR: 'bg-red-50 text-red-800 ring-red-600/20',
  DISABLED: 'bg-slate-100 text-slate-600 ring-slate-500/20',

  // Environments
  SANDBOX: 'bg-violet-50 text-violet-800 ring-violet-600/20',
  PRODUCTION: 'bg-slate-900 text-white ring-slate-900/20',
}

function formatLabel(status: string): string {
  return status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps): ReactNode {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
        —
      </span>
    )
  }

  const tone =
    TONE_BY_STATUS[status] ?? 'bg-slate-100 text-slate-700 ring-slate-500/20'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone} ${className}`}
    >
      {formatLabel(status)}
    </span>
  )
}
