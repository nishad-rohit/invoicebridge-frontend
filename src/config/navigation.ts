import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  FileText,
  LayoutDashboard,
  Network,
  Plug,
  Send,
  Settings,
  ShieldCheck,
} from 'lucide-react'

export interface NavItemConfig {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

export const mainNavigation: NavItemConfig[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your InvoiceBridge UAE workspace.',
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: Building2,
    description: 'Manage customers associated with your company.',
  },
  {
    label: 'Invoices',
    path: '/invoices',
    icon: FileText,
    description: 'Create and manage invoices for your company.',
  },
  {
    label: 'Validations',
    path: '/validations',
    icon: ShieldCheck,
    description: 'Review invoice validation results and readiness.',
  },
  {
    label: 'Submissions',
    path: '/submissions',
    icon: Send,
    description: 'Track e-invoice submissions to ASP providers.',
  },
  {
    label: 'ASP Providers',
    path: '/asp-providers',
    icon: Network,
    description: 'Configure Accredited Service Provider connections.',
  },
  {
    label: 'ERP Integrations',
    path: '/erp-integrations',
    icon: Plug,
    description: 'Connect and manage ERP system integrations.',
  },
]

export const secondaryNavigation: NavItemConfig[] = [
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Manage workspace and account preferences.',
  },
]

export const allNavigation: NavItemConfig[] = [
  ...mainNavigation,
  ...secondaryNavigation,
]

export function getPageMeta(pathname: string): Pick<NavItemConfig, 'label' | 'description'> {
  const match = allNavigation.find(
    (item) =>
      pathname === item.path || pathname.startsWith(`${item.path}/`),
  )

  if (match) {
    return {
      label: match.label,
      description: match.description,
    }
  }

  return {
    label: 'InvoiceBridge UAE',
    description: '',
  }
}
