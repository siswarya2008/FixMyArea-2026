import Reveal from './Reveal'

interface Feature {
  title: string
  description: string
  icon: JSX.Element
  accent: 'brand' | 'leaf'
}

const FEATURES: Feature[] = [
  {
    title: 'AI-Powered Detection',
    description:
      'Our model recognizes the type and severity of an issue from a single photo, so reports are accurate from the start.',
    accent: 'brand',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a4 4 0 014 4v1h1a3 3 0 013 3v1a5 5 0 01-5 5h-2v3h-2v-3H9a5 5 0 01-5-5v-1a3 3 0 013-3h1V6a4 4 0 014-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Tracking',
    description:
      'Every report has a live status — submitted, acknowledged, in progress, resolved — so you always know where things stand.',
    accent: 'leaf',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Geo-Tagged Reports',
    description:
      'Reports are pinned to an interactive map, helping authorities prioritize clusters and dispatch crews efficiently.',
    accent: 'brand',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Community Voice',
    description:
      'Upvote and comment on reports near you. The most-supported issues rise to the top for faster attention.',
    accent: 'leaf',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 18a4 4 0 100-8h-1M7 6a4 4 0 100 8h2" strokeLinecap="round" />
        <path d="M8 10h8M8 14h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Transparent Accountability',
    description:
      "See who's responsible, response times, and resolution rates. No more reports disappearing into a void.",
    accent: 'brand',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6M12 16.5v.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Free for Citizens',
    description:
      "Reporting is and always will be free for residents. Better communities shouldn't come with a price tag.",
    accent: 'leaf',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2v20M7 5h8.5a3.5 3.5 0 010 7H8.5a3.5 3.5 0 000 7H17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const accentMap = {
  brand: 'from-brand-50 to-brand-100/60 text-brand-600 ring-brand-100',
  leaf: 'from-leaf-50 to-leaf-100/60 text-leaf-600 ring-leaf-100',
}

export default function WhyFixMyArea() {
  return (
    <section id="why" className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">Why FixMyArea</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Built for citizens who care about their streets
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We combine AI, mapping, and transparency so that the problems you see
            every day actually get fixed — not just reported.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 120}>
              <article className="card group h-full">
                <span
                  className={`flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${accentMap[feature.accent]}`}
                >
                  <span className="h-6.5 w-6.5">{feature.icon}</span>
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
