import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/signin`,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-leaf-100/50 blur-3xl" />
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block">
              <Logo />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {sent ? (
              <div className="mt-6 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-4 text-sm text-leaf-700">
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-1">We've sent a password reset link to <strong>{email}</strong>.</p>
                <Link to="/signin" className="mt-3 inline-block font-semibold text-brand-600 hover:text-brand-700">
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {!sent && (
              <p className="mt-6 text-center text-sm text-slate-600">
                Remembered your password?{' '}
                <Link to="/signin" className="font-semibold text-brand-600 hover:text-brand-700">
                  Sign in
                </Link>
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            <Link to="/" className="hover:text-slate-600">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
