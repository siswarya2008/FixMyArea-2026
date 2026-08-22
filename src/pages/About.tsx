import { Link } from 'react-router-dom'
import AppNavbar from '../components/AppNavbar'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import { useAuth } from '../context/AuthContext'

const VALUES = [
  { title: 'Transparency', description: 'Every report is public, trackable, and accountable — no more disappearing complaints.' },
  { title: 'Community First', description: 'Built for citizens, not bureaucrats. The people who live there know what needs fixing.' },
  { title: 'AI-Powered', description: 'Our model classifies issues from a single photo, making reports faster and more accurate.' },
  { title: 'Free Forever', description: 'Reporting is and always will be free for residents. Better communities shouldn\'t cost money.' },
]

export default function About() {
  const { role } = useAuth()
  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-leaf-100/50 blur-3xl" />
        </div>
        <div className="container-px text-center">
          <Reveal className="mx-auto max-w-2xl">
            <span className="section-eyebrow">About Us</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              We're making communities <span className="bg-gradient-to-r from-brand-600 to-leaf-600 bg-clip-text text-transparent">better, together</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              FixMyArea was born from a simple idea: citizens see problems first, and they deserve a tool
              that turns frustration into action. We combine AI, mapping, and transparency so that the
              problems you notice every day actually get fixed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="container-px">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow">What we stand for</span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our values</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 100}>
                <article className="card h-full">
                  <h3 className="text-lg font-semibold text-slate-900">{value.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{value.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-px">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white px-8 py-14 text-center shadow-xl shadow-slate-200/50 sm:px-14">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to make a difference?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                Join thousands of citizens turning everyday problems into measurable progress.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {role !== 'authority' && <Link to="/report" className="btn-primary">Report an Issue</Link>}
                <Link to="/signup" className="btn-ghost">Create an account</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
