import { Link } from 'react-router-dom'
import Logo from './Logo'

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'How It Works', to: '/about' },
      { label: 'Why FixMyArea', to: '/about' },
      { label: 'Impact', to: '/' },
      { label: 'Report an Issue', to: '/report' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/about' },
      { label: 'Press', to: '/about' },
      { label: 'Partners', to: '/about' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', to: '/about' },
      { label: 'Community Guidelines', to: '/about' },
      { label: 'API Docs', to: '/about' },
      { label: 'Blog', to: '/about' },
    ],
  },
]

const SOCIALS = [
  {
    label: 'Twitter',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.4 9.4 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="container-px py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <Link to="/" aria-label="FixMyArea home">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              AI-powered civic reporting that turns everyday problems into measurable progress for your community.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 7l9 6 9-6M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l2-2h14l2 2" strokeLinejoin="round" />
                </svg>
                hello@fixmyarea.org
              </p>
              <p className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" strokeLinejoin="round" />
                </svg>
                +1 (555) 014-2025
              </p>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-600 transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FixMyArea. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-600"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
