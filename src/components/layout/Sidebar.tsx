import { Bridge, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mainNavigation, secondaryNavigation } from '../../config/navigation'
import NavItem from './NavItem'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <aside
      className={[
        'hidden h-full shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 lg:flex',
        collapsed ? 'w-[72px]' : 'w-[260px]',
      ].join(' ')}
      aria-label="Main navigation"
    >
      <div
        className={[
          'flex h-16 items-center border-b border-slate-800',
          collapsed ? 'justify-center px-2' : 'gap-3 px-4',
        ].join(' ')}
      >
        <Link
          to="/dashboard"
          className={[
            'flex min-w-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            collapsed ? 'justify-center' : 'gap-3',
          ].join(' ')}
          aria-label="InvoiceBridge UAE Dashboard"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-100">
            <Bridge className="h-5 w-5" aria-hidden="true" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">
                InvoiceBridge UAE
              </span>
              <span className="block truncate text-xs text-slate-400">
                e-Invoicing Platform
              </span>
            </span>
          ) : null}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {mainNavigation.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="mt-auto space-y-1 border-t border-slate-800 pt-4">
          {secondaryNavigation.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-800 p-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
