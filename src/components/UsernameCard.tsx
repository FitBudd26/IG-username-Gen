import { useState } from 'react'
import InstagramLogo from './InstagramLogo'

interface Props {
  username: string
}

export default function UsernameCard({ username }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(username)
    } catch {
      // Fallback for older browsers / restrictive iframes.
      const ta = document.createElement('textarea')
      ta.value = username
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-resulttint px-2.5 py-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <InstagramLogo size={16} className="shrink-0" />
        <span className="truncate text-[13px] font-medium text-gray-800">
          @{username}
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy username ${username}`}
        className="shrink-0 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-semibold text-teal hover:text-teal-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-1"
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M4 10l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="8"
                y="8"
                width="12"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M5 15V5a2 2 0 012-2h8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Copy
          </>
        )}
      </button>
    </div>
  )
}
