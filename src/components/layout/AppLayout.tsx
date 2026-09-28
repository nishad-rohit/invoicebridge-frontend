import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { getPageMeta } from '../../config/navigation'
import Header from './Header'
import MobileSidebar from './MobileSidebar'
import Sidebar from './Sidebar'

const SIDEBAR_COLLAPSED_KEY = 'invoicebridge_sidebar_collapsed'

function readCollapsedPreference(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  } catch {
    return false
  }
}

export default function AppLayout() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(readCollapsedPreference)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageMeta = getPageMeta(location.pathname)

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      } catch {
        // Ignore storage failures (private mode, quota, etc.)
      }
      return next
    })
  }, [])

  const closeMobileNav = useCallback(() => {
    setMobileOpen(false)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={handleToggleCollapsed}
      />

      <MobileSidebar open={mobileOpen} onClose={closeMobileNav} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          title={pageMeta.label}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
