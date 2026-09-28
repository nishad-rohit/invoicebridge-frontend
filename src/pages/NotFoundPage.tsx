import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/context/AuthContext'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()
  const destination = isAuthenticated ? '/dashboard' : '/login'
  const label = isAuthenticated ? 'Back to Dashboard' : 'Go to Login'

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-slate-500 uppercase">
          404
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-sm text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Link
        to={destination}
        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        {label}
      </Link>
    </main>
  )
}
