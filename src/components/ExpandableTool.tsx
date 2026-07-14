import { useEffect, useRef, useState } from 'react'
import UsernameGenerator from './UsernameGenerator'

/**
 * Wraps the tool so it stays at its exact compact 536px size inline, but can
 * expand into a full-screen overlay "popup" and collapse back via a close (X).
 *
 * The <UsernameGenerator /> instance stays mounted at the same tree position in
 * both states — only the wrapper classNames change — so the compact layout is
 * never altered and any typed form data / results are preserved across
 * expand/collapse.
 *
 * When embedded in an iframe, a fixed overlay can only fill the iframe's own box.
 * To make it fill the *parent page*, we also postMessage the parent on toggle;
 * a small parent-side snippet (see README) resizes the iframe to the viewport.
 */

function notifyParent(expanded: boolean) {
  // Only meaningful when actually embedded (parent !== self).
  if (typeof window === 'undefined' || window.parent === window) return
  try {
    window.parent.postMessage({ type: 'ig-tool:expand', expanded }, '*')
  } catch {
    /* ignore */
  }
}

export default function ExpandableTool() {
  const [expanded, setExpanded] = useState(false)
  const expandBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    notifyParent(expanded)
    if (!expanded) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      // Return focus to the trigger when closing.
      expandBtnRef.current?.focus()
    }
  }, [expanded])

  return (
    <div
      className={
        expanded
          ? 'fixed inset-0 z-[9999] flex items-start justify-center overflow-auto bg-black/60 p-4 sm:items-center sm:p-6'
          : 'mx-auto max-w-[536px] p-4'
      }
      onClick={expanded ? () => setExpanded(false) : undefined}
      role={expanded ? 'dialog' : undefined}
      aria-modal={expanded ? true : undefined}
      aria-label={expanded ? 'Instagram Username Generator' : undefined}
    >
      <div
        className={expanded ? 'relative w-full max-w-[720px]' : 'relative'}
        onClick={expanded ? (e) => e.stopPropagation() : undefined}
      >
        {expanded ? (
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close full screen"
            className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm ring-1 ring-gray-200 transition-colors hover:text-fitorange hover:ring-fitorange focus:outline-none focus-visible:ring-2 focus-visible:ring-fitorange"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <button
            ref={expandBtnRef}
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand to full screen"
            title="Expand"
            className="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 transition-colors hover:border-fitorange hover:text-fitorange focus:outline-none focus-visible:ring-2 focus-visible:ring-fitorange"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M12 3h5v5M17 3l-6 6M8 17H3v-5M3 17l6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <UsernameGenerator />
      </div>
    </div>
  )
}
