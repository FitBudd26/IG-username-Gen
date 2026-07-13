import { useEffect, useRef, useState } from 'react'

interface Props {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  required?: boolean
  placeholder?: string
  id: string
}

/**
 * Compact multi-select dropdown: a 40px trigger that opens a checkbox panel.
 * Keeps array (multi-select) semantics but presents as a dropdown.
 */
export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  required = false,
  placeholder = 'Select…',
  id,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
        ? selected.join(', ')
        : `${selected.length} selected`

  return (
    <div ref={ref} className="relative">
      <label
        htmlFor={`${id}-trigger`}
        className="mb-1 block text-[13px] font-semibold text-gray-700"
      >
        {label}
        {required && <span className="text-fitorange"> *</span>}
      </label>
      <button
        id={`${id}-trigger`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={[
          'flex h-[40px] w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-[14px] transition-colors',
          'focus:outline-none focus:ring-1 focus:ring-fitorange',
          open ? 'border-fitorange ring-1 ring-fitorange' : 'border-gray-300',
          selected.length ? 'text-gray-800' : 'text-gray-400',
        ].join(' ')}
      >
        <span className="truncate">{summary}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M5 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="absolute z-20 mt-1 max-h-[220px] w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt)
            return (
              <li key={opt} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => toggle(opt)}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] text-gray-700 hover:bg-resulttint focus:bg-resulttint focus:outline-none"
                >
                  <span
                    className={[
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      isSelected
                        ? 'border-fitorange bg-fitorange text-white'
                        : 'border-gray-300 bg-white',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {opt}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
