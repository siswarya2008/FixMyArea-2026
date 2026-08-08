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

export default function Issues() {
  const { user } = useAuth()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function loadData() {
      if (!user) return
      const { data } = await supabase
        .from('issues')
        .select('id, title, category, status, location, created_at, image_url')
        .order('created_at', { ascending: false })
      setIssues(data ?? [])
      setLoading(false)
    }
    loadData()
  }, [user])

  const filtered = filter === 'all' ? issues : issues.filter((i) => i.status === filter)

  const filters = ['all', 'reported', 'under_review', 'in_progress', 'resolved']

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <div className="container-px py-12 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Issues</h1>
            <p className="mt-2 text-slate-600">All the issues you've reported.</p>
          </div>
          <Link to="/report" className="btn-primary">
            Report an Issue
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f] ?? f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-10 text-center">
            <p className="text-slate-500">No issues found.</p>
            <Link to="/report" className="btn-primary mt-4">Report an issue</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${issue.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {issue.image_url ? (
                  <img src={issue.image_url} alt="" className="h-44 w-full object-cover" />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
                    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M3 8a2 2 0 012-2h2l1.2-1.6A2 2 0 0110 3.6h4a2 2 0 011.8 1.2L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinejoin="round" />
                      <circle cx="12" cy="12.5" r="3.5" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {CATEGORY_LABELS[issue.category] ?? issue.category}
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[issue.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABELS[issue.status] ?? issue.status}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-brand-700">{issue.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{issue.location}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(issue.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
