import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function AppNavbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-lg shadow-sm'
          : 'border-b border-transparent bg-white/85 backdrop-blur-lg'
      }`}
    >
      <nav className="container-px flex h-18 items-center justify-between py-3.5">
        <Link to="/" className="shrink-0" aria-label="FixMyArea home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          <Link to="/dashboard" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700">Dashboard</Link>
          <Link to="/issues" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700">My Issues</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700">About</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/report" className="btn-primary !py-2.5 !px-5 text-sm">
            Report an Issue
          </Link>
          {user && (
            <button
              onClick={handleSignOut}
              className="btn-ghost !py-2.5 !px-5 text-sm"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden">
          <div className="container-px space-y-1 border-t border-slate-100 bg-white px-5 py-4">
            <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700">Dashboard</Link>
            <Link to="/issues" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700">My Issues</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700">About</Link>
            <Link to="/report" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">Report an Issue</Link>
            {user && (
              <button onClick={() => { setOpen(false); handleSignOut() }} className="btn-ghost mt-2 w-full">Sign Out</button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
