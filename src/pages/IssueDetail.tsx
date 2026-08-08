import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import AppNavbar from '../components/AppNavbar'

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  location: string
  image_url: string | null
  created_at: string
  updated_at: string
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

const STATUS_FLOW = ['reported', 'under_review', 'in_progress', 'resolved']

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!id || !user) return
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        setError(error.message)
      } else if (!data) {
        setError('Issue not found.')
      } else {
        setIssue(data)
      }
      setLoading(false)
    }
    load()
  }, [id, user])

  const currentStep = issue ? STATUS_FLOW.indexOf(issue.status) : -1

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppNavbar />
        <div className="container-px py-12 pt-32 text-center text-slate-500">Loading…</div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppNavbar />
        <div className="container-px py-12 pt-32 text-center">
          <p className="text-lg text-slate-600">{error || 'Issue not found.'}</p>
          <Link to="/issues" className="btn-primary mt-4">Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNavbar />

      <div className="container-px py-12 pt-32">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          {/* Status badge */}
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[issue.status] ?? 'bg-slate-100 text-slate-600'}`}>
            {STATUS_LABELS[issue.status] ?? issue.status}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{issue.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {CATEGORY_LABELS[issue.category] ?? issue.category} · {issue.location}
          </p>

          {/* Image */}
          {issue.image_url && (
            <img src={issue.image_url} alt={issue.title} className="mt-6 w-full rounded-2xl object-cover" />
          )}

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-600">{issue.description}</p>
          </div>

          {/* Status timeline */}
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Status Timeline</h2>
            <div className="mt-5 flex items-center justify-between">
              {STATUS_FLOW.map((status, i) => (
                <div key={status} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-brand-500' : 'bg-slate-200'}`} />
                    )}
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      i <= currentStep ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i <= currentStep ? '✓' : i + 1}
                    </span>
                    {i < STATUS_FLOW.length - 1 && (
                      <div className={`h-1 flex-1 rounded-full ${i < currentStep ? 'bg-brand-500' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  <span className="mt-2 text-center text-xs font-medium text-slate-500">
                    {STATUS_LABELS[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Reported on</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {new Date(issue.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-xs font-medium text-slate-500">Last updated</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {new Date(issue.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
