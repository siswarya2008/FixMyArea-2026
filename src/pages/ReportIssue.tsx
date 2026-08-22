import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import AppNavbar from '../components/AppNavbar'

const CATEGORIES = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'garbage', label: 'Garbage Dump' },
  { value: 'streetlight', label: 'Broken Streetlight' },
  { value: 'water_leak', label: 'Water Leak' },
  { value: 'road_damage', label: 'Damaged Road' },
  { value: 'manhole', label: 'Open Manhole' },
  { value: 'other', label: 'Other' },
]

type AnalysisCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leak'
  | 'road_damage'
  | 'manhole'
  | 'other'

interface AnalysisResult {
  category: AnalysisCategory
  severity: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  description: string
  reasoning: string
}

export default function ReportIssue() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [detectedAddress, setDetectedAddress] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysisError, setAnalysisError] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setAnalysisResult(null)
    setAnalysisError('')
    setError('')
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Please enter a title.'
    if (!description.trim()) next.description = 'Please describe the issue.'
    if (!category) next.category = 'Please select a category.'
    if (!location.trim()) next.location = 'Please enter a location.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported by this browser. Please enter a location manually.')
      return
    }

    setLocationLoading(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextLatitude = Number(coords.latitude.toFixed(6))
        const nextLongitude = Number(coords.longitude.toFixed(6))
        const coordinateLabel = `Latitude: ${nextLatitude}, Longitude: ${nextLongitude}`

        setLatitude(nextLatitude)
        setLongitude(nextLongitude)
        setLocation(coordinateLabel)
        setDetectedAddress('')

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nextLatitude}&lon=${nextLongitude}`,
          )
          if (!response.ok) throw new Error('Reverse geocoding failed')
          const result = await response.json()
          const address = typeof result.display_name === 'string' ? result.display_name : ''
          if (address) {
            setDetectedAddress(address)
            setLocation(address)
          }
        } catch {
          // Coordinates remain available when address lookup is unavailable.
        } finally {
          setLocationLoading(false)
        }
      },
      (positionError) => {
        const message = positionError.code === positionError.PERMISSION_DENIED
          ? 'Location permission was denied. Please allow access or enter a location manually.'
          : positionError.code === positionError.TIMEOUT
            ? 'Location detection timed out. Please try again or enter a location manually.'
            : 'Unable to detect your location. Please try again or enter it manually.'
        setLocationError(message)
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const handleAnalyze = async () => {
    if (!imageFile) return

    setAnalysisLoading(true)
    setAnalysisError('')
    setAnalysisResult(null)

    try {
      const imageDataUrl = await readFileAsDataUrl(imageFile)
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          image: imageDataUrl,
          filename: imageFile.name,
          latitude,
          longitude,
          location: location.trim(),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || 'AI analysis failed. Please try again.')
      }

      setAnalysisResult(payload)
    } catch (err) {
      console.error('AI analysis error:', err)
      if (err instanceof Error) {
        setAnalysisError(err.message)
      } else {
        setAnalysisError('AI analysis failed. Please try again.')
      }
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleUseSuggestion = () => {
  if (!analysisResult) return

  setTitle(`Large ${analysisResult.category} reported`)
  setCategory(analysisResult.category)
  setDescription(analysisResult.description)

  setErrors((prev) => ({
    ...prev,
    title: "",
    category: "",
    description: "",
  }))
}

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) {
  return
}

    if (!user) {
      setError('You must be signed in to report an issue.')
      return
    }

    setLoading(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('issue-photos')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('issue-photos')
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }

     console.log('ABOUT TO INSERT INTO ISSUES TABLE')
      const { data, error: insertError } = await supabase
        .from('issues')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          lat: latitude,
          lng: longitude,
          image_url: imageUrl,
        })
        .select('id')
        .single()

      if (insertError) throw insertError

      navigate(`/issues/${data.id}`, { replace: true })
    } catch (err) {
  console.error('SUBMIT REPORT ERROR:', err)

  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError('Failed to submit report. Please try again.')
  }

  setLoading(false)
}
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
        <div className="absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />
      </div>

      <div className="container-px py-12 pt-32">
        <div className="mx-auto max-w-2xl">
          <span className="section-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
            New Report
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Report an Issue</h1>
          <p className="mt-3 text-lg text-slate-600">
            Fill in the details below and we'll route your report to the right authority.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700">Issue Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Large pothole on Main Street"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-600">{errors.category}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, how long it's been there, and any safety concerns…"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700">Location</label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading || loading}
                  className="btn-ghost !px-3 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {locationLoading ? 'Detecting location…' : '📍 Use My Current Location'}
                </button>
              </div>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setLatitude(null)
                  setLongitude(null)
                  setDetectedAddress('')
                }}
                placeholder="e.g. 123 Main Street, Sector 14"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              {locationLoading && <p className="mt-2 text-sm text-slate-500">Requesting your current location…</p>}
              {locationError && <p className="mt-2 text-sm text-red-600">{locationError}</p>}
              {latitude !== null && longitude !== null && !locationLoading && (
                <div className="mt-3 rounded-xl border border-leaf-100 bg-leaf-50 px-4 py-3 text-sm text-leaf-800">
                  <p className="font-semibold">✓ Location detected</p>
                  <p className="mt-1">Latitude: {latitude}</p>
                  <p>Longitude: {longitude}</p>
                  {detectedAddress && <p className="mt-1">Address: {detectedAddress}</p>}
                </div>
              )}
              {errors.location && <p className="mt-1.5 text-xs text-red-600">{errors.location}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">Photo (optional)</label>
              <p className="mt-1 text-xs text-slate-500">Upload a photo of the issue. Max 10 MB.</p>
              <div className="mt-3">
                {imagePreview ? (
                  <div>
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="h-52 w-full rounded-xl object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreview('')
                          setAnalysisResult(null)
                          setAnalysisError('')
                        }}
                        className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md hover:bg-white"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={analysisLoading || loading}
                        className="btn-ghost w-full disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {analysisLoading ? 'Analyzing image…' : 'Analyze with AI'}
                      </button>
                      {analysisError && (
                        <p className="mt-2 text-sm text-red-600">{analysisError}</p>
                      )}
                    </div>

                    {analysisResult && (
                      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">AI image analysis</p>
                            <p className="mt-1 text-sm text-slate-600">Review the suggested issue details before submitting.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleUseSuggestion}
                            className="btn-primary rounded-full px-4 py-2 text-sm"
                          >
                            Use Suggestion
                          </button>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{analysisResult.category}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Severity</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{analysisResult.severity}</p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{analysisResult.confidence}%</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested description</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysisResult.description}</p>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reasoning</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysisResult.reasoning}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition-all hover:border-brand-300 hover:bg-brand-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8a2 2 0 012-2h2l1.2-1.6A2 2 0 0110 3.6h4a2 2 0 011.8 1.2L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinejoin="round" />
                      <circle cx="12" cy="12.5" r="3.5" />
                    </svg>
                    <span className="mt-3 text-sm font-medium text-slate-600">Click to upload a photo</span>
                    <span className="mt-1 text-xs text-slate-400">PNG, JPG up to 10 MB</span>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
