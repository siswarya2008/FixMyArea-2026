import Reveal from './Reveal'

interface Step {
  number: string
  title: string
  description: string
  icon: JSX.Element
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Take a Photo',
    description:
      'Spot a problem in your neighborhood? Capture it on your phone — no forms to fill out upfront.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8a2 2 0 012-2h2l1.2-1.6A2 2 0 0110 3.6h4a2 2 0 011.8 1.2L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinejoin="round" />
        <circle cx="12" cy="12.5" r="3.5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Identifies the Problem',
    description:
      'Our AI analyzes the image and auto-classifies the issue — pothole, leak, garbage, streetlight — in seconds.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Submit Report',
    description:
      'Confirm the details and location, then submit. Your report is routed to the right authority instantly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Track Progress',
    description:
      'Follow your report from submitted to resolved. Get updates as authorities pick up and fix the issue.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">How it works</span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From snapshot to solution in four steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Reporting a problem takes less than a minute. Here's the journey every report follows.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 120}>
              <article className="card group relative h-full overflow-hidden">
                <span className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-extrabold text-slate-100 transition-colors group-hover:text-brand-50">
                  {step.number}
                </span>
                <div className="relative">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-leaf-50 text-brand-600 ring-1 ring-brand-100 transition-transform duration-300 group-hover:scale-110">
                    <span className="h-7 w-7">{step.icon}</span>
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
