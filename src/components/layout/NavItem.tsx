import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface NavItemProps {
  to: string
  label: string
  icon: LucideIcon
  collapsed?: boolean
  onNavigate?: () => void
}

export default function NavItem({
  to,
  label,
  icon: Icon,
  collapsed = false,
  onNavigate,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      aria-label={label}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group flex items-center rounded-md text-sm font-medium transition-colors',
          collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
          isActive
            ? 'bg-slate-800 text-white'
            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        ].join(' ')
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </NavLink>
  )
}
