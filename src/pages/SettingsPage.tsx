import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useAuth } from '../features/auth/context/AuthContext'
import { formatEnumLabel } from '../utils/format'

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{value || '—'}</dd>
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Account and workspace information available from authenticated APIs."
      />

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Account / Profile
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Email" value={user?.email} />
          <Field label="User ID" value={user?.userId} />
          <Field label="Company ID" value={user?.companyId} />
          <div>
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
              Role
            </dt>
            <dd className="mt-1">
              {user?.role ? (
                <StatusBadge status={user.role} />
              ) : (
                <span className="text-sm text-slate-900">—</span>
              )}
            </dd>
          </div>
          <Field
            label="Role (label)"
            value={user?.role ? formatEnumLabel(user.role) : null}
          />
        </dl>
      </section>

      <section className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          Company Information
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          No authenticated company profile GET endpoint is currently exposed by
          the backend. Company creation exists at registration time only. This
          section is read-only and intentionally has no Save action.
        </p>
      </section>
    </div>
  )
}
