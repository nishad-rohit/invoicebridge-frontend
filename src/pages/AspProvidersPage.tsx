import { useState, type FormEvent } from 'react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import Modal, {
  emptyToUndefined,
  FormField,
  inputClassName,
} from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/common/StatusBadge'
import { useToast } from '../components/feedback/ToastProvider'
import {
  useAspConnections,
  useAspProviders,
  useConnectAspConnection,
  useCreateAspConnection,
} from '../features/asp/hooks/useAsp'
import type { AspEnvironment } from '../features/asp/types'
import { formatDateTime } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

export default function AspProvidersPage() {
  const toast = useToast()
  const providersQuery = useAspProviders()
  const connectionsQuery = useAspConnections()
  const createConnection = useCreateAspConnection()
  const connectConnection = useConnectAspConnection()

  const [modalOpen, setModalOpen] = useState(false)
  const [aspProviderId, setAspProviderId] = useState('')
  const [environment, setEnvironment] = useState<AspEnvironment>('SANDBOX')
  const [externalAccountId, setExternalAccountId] = useState('')
  const [credentialsReference, setCredentialsReference] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const providers = providersQuery.data ?? []
  const connections = connectionsQuery.data ?? []

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    if (!aspProviderId) {
      setFormError('ASP provider is required.')
      return
    }
    setFormError(null)
    try {
      await createConnection.mutateAsync({
        aspProviderId,
        environment,
        externalAccountId: emptyToUndefined(externalAccountId),
        credentialsReference: emptyToUndefined(credentialsReference),
      })
      toast.success('ASP connection created.')
      setModalOpen(false)
      setAspProviderId('')
      setExternalAccountId('')
      setCredentialsReference('')
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  async function handleConnect(id: string) {
    try {
      await connectConnection.mutateAsync(id)
      toast.success('ASP connection activated.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const loading = providersQuery.isLoading || connectionsQuery.isLoading
  const error = providersQuery.error || connectionsQuery.error

  return (
    <div className="space-y-8">
      <PageHeader
        title="ASP Providers"
        description="View configured Accredited Service Providers and manage company ASP connections."
        actions={
          providers.length > 0 ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Connection
            </button>
          ) : null
        }
      />

      {loading ? <LoadingState label="Loading ASP providers…" /> : null}

      {error ? (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => {
            void providersQuery.refetch()
            void connectionsQuery.refetch()
          }}
        />
      ) : null}

      {!loading && !error ? (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Available Providers
            </h2>
            {providers.length === 0 ? (
              <EmptyState
                title="No ASP providers are currently configured."
                description="Active ASP providers must be seeded or configured in the backend before connections can be created."
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                      <tr>
                        <th className="px-4 py-3">Provider</th>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">API Base URL</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {providers.map((provider) => (
                        <tr key={provider.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {provider.name}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{provider.code}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {provider.apiBaseUrl || '—'}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={provider.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Company Connections
            </h2>
            {connections.length === 0 ? (
              <EmptyState
                title="No ASP connections yet."
                description="Create a connection to an available ASP provider for your company."
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                      <tr>
                        <th className="px-4 py-3">Provider</th>
                        <th className="px-4 py-3">Environment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Connected At</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {connections.map((connection) => (
                        <tr key={connection.id}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">
                              {connection.providerName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {connection.providerCode}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={connection.environment} />
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={connection.status} />
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {formatDateTime(connection.connectedAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {connection.status !== 'CONNECTED' ? (
                              <button
                                type="button"
                                onClick={() => void handleConnect(connection.id)}
                                disabled={connectConnection.isPending}
                                className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                              >
                                Connect
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </>
      ) : null}

      <Modal
        open={modalOpen}
        title="Add ASP Connection"
        onClose={() => setModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={(e) => void handleCreate(e)}>
          <FormField label="ASP Provider" htmlFor="aspProviderId" required>
            <select
              id="aspProviderId"
              className={inputClassName}
              value={aspProviderId}
              onChange={(e) => setAspProviderId(e.target.value)}
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Environment" htmlFor="environment" required>
            <select
              id="environment"
              className={inputClassName}
              value={environment}
              onChange={(e) =>
                setEnvironment(e.target.value as AspEnvironment)
              }
            >
              <option value="SANDBOX">Sandbox</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </FormField>
          <FormField label="External Account ID" htmlFor="externalAccountId">
            <input
              id="externalAccountId"
              className={inputClassName}
              value={externalAccountId}
              onChange={(e) => setExternalAccountId(e.target.value)}
            />
          </FormField>
          <FormField
            label="Credentials Reference"
            htmlFor="credentialsReference"
          >
            <input
              id="credentialsReference"
              className={inputClassName}
              value={credentialsReference}
              onChange={(e) => setCredentialsReference(e.target.value)}
            />
          </FormField>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createConnection.isPending}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {createConnection.isPending ? 'Creating…' : 'Create Connection'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
