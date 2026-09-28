import { Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import AspProvidersPage from '../pages/AspProvidersPage'
import CustomerDetailPage from '../pages/CustomerDetailPage'
import CustomersPage from '../pages/CustomersPage'
import DashboardPage from '../pages/DashboardPage'
import ErpIntegrationsPage from '../pages/ErpIntegrationsPage'
import HomePage from '../pages/HomePage'
import InvoiceCreatePage from '../pages/InvoiceCreatePage'
import InvoiceDetailPage from '../pages/InvoiceDetailPage'
import InvoiceEditPage from '../pages/InvoiceEditPage'
import InvoicesPage from '../pages/InvoicesPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import RegisterPage from '../pages/RegisterPage'
import SettingsPage from '../pages/SettingsPage'
import SubmissionsPage from '../pages/SubmissionsPage'
import ValidationsPage from '../pages/ValidationsPage'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />

          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/new" element={<InvoiceCreatePage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceEditPage />} />

          <Route path="/validations" element={<ValidationsPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="/asp-providers" element={<AspProvidersPage />} />
          <Route path="/erp-integrations" element={<ErpIntegrationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
