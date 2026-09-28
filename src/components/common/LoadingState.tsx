import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  label?: string
}

export default function LoadingState({
  label = 'Loading…',
}: LoadingStateProps) {
  return (
    <div
      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-16 text-sm text-slate-600"
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
