import { useState, type FormEvent } from 'react'
import ConfirmDialog from '../components/common/ConfirmDialog'
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
  useCreateErpIntegration,
  useDisableErpIntegration,
  useErpIntegrations,
  useSyncErpIntegration,
  useTestErpConnection,
  useUpdateErpIntegration,
} from '../features/erp/hooks/useErp'
import type {
  CreateErpIntegrationRequest,
  ErpIntegration,
  ErpIntegrationType,
  UpdateErpIntegrationRequest,
} from '../features/erp/types'
import { formatDateTime, formatEnumLabel } from '../utils/format'
import { getApiErrorMessage } from '../utils/apiError'

const ERP_TYPES: ErpIntegrationType[] = [
  'SAP',
  'ORACLE',
  'MICROSOFT_DYNAMICS',
  'ZOHO',
  'QUICKBOOKS',
  'CUSTOM_API',
]

interface ErpFormState {
  integrationType: ErpIntegrationType
  name: string
  baseUrl: string
  configuration: string
}

const emptyForm: ErpFormState = {
  integrationType: 'CUSTOM_API',
  name: '',
  baseUrl: '',
  configuration: '',
}

export default function ErpIntegrationsPage() {
  const toast = useToast()
  const integrationsQuery = useErpIntegrations()
  const createIntegration = useCreateErpIntegration()
  const updateIntegration = useUpdateErpIntegration()
  const disableIntegration = useDisableErpIntegration()
  const testConnection = useTestErpConnection()
  const syncIntegration = useSyncErpIntegration()

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<ErpIntegration | null>(null)
  const [form, setForm] = useState<ErpFormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [disableTarget, setDisableTarget] = useState<ErpIntegration | null>(
    null,
  )
  const [testingId, setTestingId] = useState<string | null>(null)

  const integrations = integrationsQuery.data ?? []

  function openCreate() {
    setSelected(null)
    setForm(emptyForm)
    setFormError(null)
    setModalMode('create')
  }

  function openEdit(integration: ErpIntegration) {
    setSelected(integration)
    setForm({
      integrationType: integration.integrationType as ErpIntegrationType,
      name: integration.name,
      baseUrl: integration.baseUrl ?? '',
      configuration: integration.configuration ?? '',
    })
    setFormError(null)
    setModalMode('edit')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.name.trim()) {
      setFormError('Name is required.')
      return
    }
    setFormError(null)

    try {
      if (modalMode === 'create') {
        const payload: CreateErpIntegrationRequest = {
          integrationType: form.integrationType,
          name: form.name.trim(),
          baseUrl: emptyToUndefined(form.baseUrl),
          configuration: emptyToUndefined(form.configuration),
        }
        await createIntegration.mutateAsync(payload)
        toast.success('ERP integration created.')
      } else if (selected) {
        const payload: UpdateErpIntegrationRequest = {
          name: form.name.trim(),
          baseUrl: emptyToUndefined(form.baseUrl),
          configuration: emptyToUndefined(form.configuration),
        }
        await updateIntegration.mutateAsync({ id: selected.id, payload })
        toast.success('ERP integration updated.')
      }
      setModalMode(null)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
    }
  }

  async function handleTest(id: string) {
    setTestingId(id)
    try {
      const result = await testConnection.mutateAsync(id)
      if (result.status === 'CONNECTED') {
        toast.success('Connection successful.')
      } else if (result.status === 'ERROR') {
        toast.error('Connection failed.')
      } else {
        toast.info(`Connection status: ${formatEnumLabel(String(result.status))}`)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setTestingId(null)
    }
  }

  async function handleSync(id: string) {
    try {
      await syncIntegration.mutateAsync(id)
      toast.success('Sync started.')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  async function handleDisable() {
    if (!disableTarget) return
    try {
      await disableIntegration.mutateAsync(disableTarget.id)
      toast.success('ERP integration disabled.')
      setDisableTarget(null)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  const busy =
    createIntegration.isPending || updateIntegration.isPending

  return (
    <div>
      <PageHeader
        title="ERP Integrations"
        description="Connect InvoiceBridge UAE to your accounting or ERP system."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Integration
          </button>
        }
      />

      {integrationsQuery.isLoading ? (
        <LoadingState label="Loading ERP integrations…" />
      ) : null}

      {integrationsQuery.isError ? (
        <ErrorState
          message={getApiErrorMessage(integrationsQuery.error)}
          onRetry={() => void integrationsQuery.refetch()}
        />
      ) : null}

      {integrationsQuery.isSuccess && integrations.length === 0 ? (
        <EmptyState
          title="No ERP integrations configured."
          description="Add an ERP integration to sync invoices from your accounting system."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Integration
            </button>
          }
        />
      ) : null}

      {integrationsQuery.isSuccess && integrations.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Integration</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Sync</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {integrations.map((integration) => (
                  <tr key={integration.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">
                        {integration.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {integration.baseUrl || 'No base URL'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatEnumLabel(String(integration.integrationType))}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={integration.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatDateTime(integration.lastSyncAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(integration)}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleTest(integration.id)}
                          disabled={testingId === integration.id}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {testingId === integration.id
                            ? 'Testing…'
                            : 'Test Connection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSync(integration.id)}
                          disabled={syncIntegration.isPending}
                          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          Sync
                        </button>
                        {integration.status !== 'DISABLED' ? (
                          <button
                            type="button"
                            onClick={() => setDisableTarget(integration)}
                            className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Disable
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <Modal
        open={modalMode !== null}
        title={modalMode === 'create' ? 'Add ERP Integration' : 'Edit ERP Integration'}
        onClose={() => setModalMode(null)}
        wide
      >
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          {modalMode === 'create' ? (
            <FormField label="Integration Type" htmlFor="integrationType" required>
              <select
                id="integrationType"
                className={inputClassName}
                value={form.integrationType}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    integrationType: e.target.value as ErpIntegrationType,
                  }))
                }
              >
                {ERP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {formatEnumLabel(type)}
                  </option>
                ))}
              </select>
            </FormField>
          ) : (
            <FormField label="Integration Type" htmlFor="integrationTypeReadonly">
              <input
                id="integrationTypeReadonly"
                className={inputClassName}
                value={formatEnumLabel(form.integrationType)}
                disabled
              />
            </FormField>
          )}
          <FormField label="Name" htmlFor="erpName" required>
            <input
              id="erpName"
              className={inputClassName}
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Base URL" htmlFor="baseUrl">
            <input
              id="baseUrl"
              className={inputClassName}
              value={form.baseUrl}
              onChange={(e) =>
                setForm((current) => ({ ...current, baseUrl: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Configuration (JSON/text)" htmlFor="configuration">
            <textarea
              id="configuration"
              rows={4}
              className={inputClassName}
              value={form.configuration}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  configuration: e.target.value,
                }))
              }
            />
            <p className="mt-1 text-xs text-slate-500">
              Do not paste live secrets into the UI if avoidable. Prefer secure
              credential references configured on the backend.
            </p>
          </FormField>
          {formError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalMode(null)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={disableTarget !== null}
        title="Disable this ERP integration?"
        description="The integration will be marked as disabled and will no longer sync."
        confirmLabel="Disable"
        tone="danger"
        busy={disableIntegration.isPending}
        onCancel={() => setDisableTarget(null)}
        onConfirm={() => void handleDisable()}
      />
    </div>
  )
}
