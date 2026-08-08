import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function CTA() {
  return (
    <section id="report" className="py-20 lg:py-28">
      <div className="container-px">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white px-8 py-14 text-center shadow-xl shadow-slate-200/50 sm:px-14 lg:py-20">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]" />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              See something broken? Report it in 60 seconds.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Join thousands of citizens making their neighborhoods cleaner, safer, and better — one report at a time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/report" className="btn-primary">
                Report an Issue
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/about" className="btn-ghost">
                Learn more
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
