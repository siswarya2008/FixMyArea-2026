interface LogoProps {
  className?: string
  showWordmark?: boolean
}

/**
 * FixMyArea brand mark — a location pin formed by a rounded checkmark,
 * signalling "fix" + "area". Paired with the wordmark by default.
 */
export default function Logo({ className = '', showWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9"
        aria-hidden="true"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 3.5c-6.9 0-12.5 5.4-12.5 12.1 0 8.6 11 19.4 11.5 19.9.6.6 12.5-11.3 12.5-19.9C32.5 8.9 26.9 3.5 20 3.5Z"
          fill="url(#pinGrad)"
        />
        <path
          d="M14.2 20.1l3.4 3.4 8-8"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="pinGrad" x1="20" y1="3.5" x2="20" y2="35.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
          Fix<span className="text-brand-600">My</span>Area
        </span>
      )}
    </span>
  )
}
