import { Bridge, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mainNavigation, secondaryNavigation } from '../../config/navigation'
import NavItem from './NavItem'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="lg:hidden" role="presentation">
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-950/50"
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside
        className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-slate-950 text-slate-100 shadow-xl"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="InvoiceBridge UAE Dashboard"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-800">
              <Bridge className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">
                InvoiceBridge UAE
              </span>
              <span className="block truncate text-xs text-slate-400">
                e-Invoicing Platform
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {mainNavigation.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                label={item.label}
                icon={item.icon}
                onNavigate={onClose}
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
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>
      </aside>
    </div>
  )
}
