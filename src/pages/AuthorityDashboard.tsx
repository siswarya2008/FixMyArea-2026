import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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

const STATUS_LABELS: Record<string, string> = {
  reported: 'Reported',
  under_review: 'Under Review',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const STATUS_STYLES: Record<string, string> = {
  reported: 'bg-amber-100 text-amber-700',
  under_review: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  resolved: 'bg-leaf-100 text-leaf-700',
}

const CATEGORY_LABELS: Record<string, string> = {
  pothole: 'Pothole', garbage: 'Garbage Dump', streetlight: 'Broken Streetlight',
  water_leak: 'Water Leak', road_damage: 'Damaged Road', manhole: 'Open Manhole', other: 'Other',
}

export default function AuthorityDashboard() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('status') ?? 'all'
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadIssues() {
      setLoading(true)
      const { data, error: queryError } = await supabase
        .from('issues')
        .select('id, title, category, status, location, created_at, image_url')
        .order('created_at', { ascending: false })
      if (queryError) setError(queryError.message)
      setIssues(data ?? [])
      setLoading(false)
    }
    loadIssues()
  }, [])

  const counts = {
    total: issues.length,
    reported: issues.filter((issue) => issue.status === 'reported' || issue.status === 'under_review').length,
    inProgress: issues.filter((issue) => issue.status === 'in_progress').length,
    resolved: issues.filter((issue) => issue.status === 'resolved').length,
  }
  const visibleIssues = filter === 'all'
    ? issues
    : filter === 'pending'
      ? issues.filter((issue) => issue.status === 'reported' || issue.status === 'under_review')
      : issues.filter((issue) => issue.status === filter)
  const filters = [
    { label: 'All Issues', value: 'all' },
    { label: 'Pending / Reported', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Resolved', value: 'resolved' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />
      <div className="container-px py-12 pt-32">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Authority Dashboard</h1>
          <p className="mt-2 text-slate-600">Review community reports and keep residents informed.</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Total Reports', counts.total, 'from-brand-500 to-brand-600'],
            ['Pending / Reported', counts.reported, 'from-amber-400 to-amber-500'],
            ['In Progress', counts.inProgress, 'from-blue-500 to-blue-600'],
            ['Resolved', counts.resolved, 'from-leaf-500 to-leaf-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className={`mt-2 font-display text-4xl font-extrabold text-slate-900`}>{value}</p>
              <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${color}`} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Issues</h2>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Link key={item.value} to={item.value === 'all' ? '/authority' : `/authority?status=${item.value}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === item.value ? 'bg-brand-600 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">Loading…</div>
        ) : visibleIssues.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-10 text-center text-slate-500">No issues found.</div>
        ) : (
          <div className="mt-5 space-y-3">
            {visibleIssues.slice(0, filter === 'all' ? 5 : undefined).map((issue) => (
              <div key={issue.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                {issue.image_url ? <img src={issue.image_url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{issue.title}</p>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{CATEGORY_LABELS[issue.category] ?? issue.category} · {issue.location}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <span className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-block ${STATUS_STYLES[issue.status] ?? 'bg-slate-100 text-slate-600'}`}>{STATUS_LABELS[issue.status] ?? issue.status}</span>
                <Link to={`/issues/${issue.id}`} className="btn-ghost shrink-0 !px-3 !py-2 text-sm">View Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}