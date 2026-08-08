import Logo from './Logo'

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="animate-pulse">
        <Logo showWordmark={false} />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500">Loading…</p>
    </div>
  )
}
