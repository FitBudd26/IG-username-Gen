interface Props {
  label: string
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
  required?: boolean
  id: string
}

/**
 * Compact selectable chips for multi-select fields.
 * Selected state uses FitBudd orange + a checkmark (not color alone).
 */
export default function MultiSelectChips({
  label,
  options,
  selected,
  onChange,
  required = false,
  id,
}: Props) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  return (
    <fieldset className="m-0 p-0 border-0" aria-labelledby={`${id}-label`}>
      <legend
        id={`${id}-label`}
        className="text-[13px] font-semibold text-gray-700 mb-1.5 p-0"
      >
        {label}
        {required && <span className="text-fitorange"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(opt)}
              className={[
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] leading-tight transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-fitorange focus-visible:ring-offset-1',
                isSelected
                  ? 'bg-fitorange border-fitorange text-white font-semibold'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-fitorange',
              ].join(' ')}
            >
              {isSelected && (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10l4 4 8-8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {opt}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
