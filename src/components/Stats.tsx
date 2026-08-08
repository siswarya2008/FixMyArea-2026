import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'

interface Stat {
  label: string
  value: number
  suffix: string
}

const STATS: Stat[] = [
  { label: 'Issues Reported', value: 48230, suffix: '+' },
  { label: 'Cities Covered', value: 36, suffix: '' },
  { label: 'Active Users', value: 129000, suffix: '+' },
]

function formatValue(n: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const duration = 1800
            const start = performance.now()
            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setDisplay(value * eased)
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {formatValue(display)}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section id="impact" className="relative py-24 lg:py-28">
      <div className="container-px">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-leaf-600 px-8 py-14 sm:px-14 lg:py-20">
            {/* decorative grid */}
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-leaf-300/20 blur-2xl" />

            <div className="relative grid gap-10 text-center sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wider text-brand-100/90">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
