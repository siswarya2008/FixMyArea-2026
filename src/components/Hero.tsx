import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HERO_IMAGE =
  'https://images.pexels.com/photos/17131944/pexels-photo-17131944.jpeg?auto=compress&cs=tinysrgb&w=1200'

const ISSUE_TAGS = [
  'Potholes',
  'Garbage dumps',
  'Broken streetlights',
  'Water leaks',
  'Damaged roads',
  'Open manholes',
]

export default function Hero() {
  const { role } = useAuth()
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-leaf-100/50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(59,130,246,0.08),transparent_55%)]" />
      </div>

      <div className="container-px grid items-center gap-14 lg:grid-cols-2">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="section-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            AI-powered civic reporting
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Report Problems.
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-leaf-600 bg-clip-text text-transparent">
              Improve Communities.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            FixMyArea lets you report public infrastructure problems in seconds —
            potholes, garbage dumps, broken streetlights, water leaks and more.
            Snap a photo, let AI identify the issue, and track it until it's fixed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {role !== 'authority' && <Link to="/report" className="btn-primary">
              Report an Issue
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>}
            <Link to="/about" className="btn-ghost">
              See how it works
            </Link>
          </div>

          {/* Issue tags */}
          <ul className="mt-10 flex flex-wrap gap-2.5">
            {ISSUE_TAGS.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-2xl shadow-slate-300/50 ring-1 ring-slate-200/60">
            <img
              src={HERO_IMAGE}
              alt="Urban street infrastructure"
              className="h-[340px] w-full object-cover sm:h-[460px] lg:h-[520px]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
          </div>

          {/* Floating report card */}
          <div className="absolute -bottom-6 -left-4 w-64 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:-left-8 animate-float">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-leaf-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Pothole reported</p>
                <p className="text-xs text-slate-500">AI verified · Sector 14</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-500 to-leaf-500" />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-400">In progress · 67% resolved</p>
          </div>

          {/* Floating AI badge */}
          <div className="absolute -right-3 top-6 flex items-center gap-2 rounded-full border border-slate-100 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-sm sm:-right-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-600" />
            </span>
            <span className="text-xs font-semibold text-slate-700">AI analyzing…</span>
          </div>
        </div>
      </div>
    </section>
  )
}
