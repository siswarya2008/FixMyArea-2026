import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import AppNavbar from '../components/AppNavbar'

interface Issue {
  id: string
  title: string
  category: string
  status: string
  location: string
  created_at: string
  image_url: string | null
}

interface Stats {
  total: number
  active: number
  resolved: number
}

const STATUS_STYLES: Record<string, string> = {
  reported: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-leaf-100 text-leaf-700',
}

const STATUS_LABELS: Record<string, string> = {
  reported: 'Reported',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Pothole',
  garbage: 'Garbage Dump',
  streetlight: 'Broken Streetlight',
  water_leak: 'Water Leak',
  road_damage: 'Damaged Road',
  manhole: 'Open Manhole',
  other: 'Other',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, resolved: 0 })
  const [recent, setRecent] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return
      const { data, error } = await supabase
        .from('issues')
        .select('id, title, category, status, location, created_at, image_url')
        .order('created_at', { ascending: false })

      if (error) {
        setLoading(false)
        return
      }

      const issues = data ?? []
      setStats({
        total: issues.length,
        active: issues.filter((i) => i.status !== 'resolved').length,
        resolved: issues.filter((i) => i.status === 'resolved').length,
      })
      setRecent(issues.slice(0, 5))
      setLoading(false)
    }
    loadData()
  }, [user])

  const statCards = [
    { label: 'Total Reports', value: stats.total, color: 'from-brand-500 to-brand-600', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Active Reports', value: stats.active, color: 'from-amber-400 to-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Resolved Reports', value: stats.resolved, color: 'from-leaf-500 to-leaf-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <div className="container-px py-12 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back{user?.email ? `, ${user.email}` : ''}.</p>
          </div>
          <Link to="/report" className="btn-primary">
            Report an Issue
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 font-display text-4xl font-extrabold text-slate-900">{card.value}</p>
                </div>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d={card.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent reports */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Reports</h2>
            <Link to="/issues" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">
              Loading…
            </div>
          ) : recent.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-10 text-center">
              <p className="text-slate-500">You haven't reported any issues yet.</p>
              <Link to="/report" className="btn-primary mt-4">Report your first issue</Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recent.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issues/${issue.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {issue.image_url ? (
                    <img src={issue.image_url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8a2 2 0 012-2h2l1.2-1.6A2 2 0 0110 3.6h4a2 2 0 011.8 1.2L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinejoin="round" />
                        <circle cx="12" cy="12.5" r="3.5" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {CATEGORY_LABELS[issue.category] ?? issue.category} · {issue.location}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[issue.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[issue.status] ?? issue.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
