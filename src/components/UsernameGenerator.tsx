import { useMemo, useState } from 'react'
import type { LeadFormData } from '../types'
import {
  FITNESS_NICHES,
  TRAINER_TYPES,
  TONE_STYLES,
} from '../types'
import { generateUsernames } from '../lib/generateUsernames'
import { trackLead, trackCtaClick } from '../lib/tracking'
import InstagramLogo from './InstagramLogo'
import MultiSelectChips from './MultiSelectChips'
import MultiSelectDropdown from './MultiSelectDropdown'
import UsernameCard from './UsernameCard'
import CTASection from './CTASection'

const EMPTY: LeadFormData = {
  fullName: '',
  email: '',
  niches: [],
  trainerTypes: [],
  tones: [],
  keyword: '',
}

const inputClass =
  'h-[40px] w-full rounded-lg border border-gray-300 px-3 text-[14px] text-gray-800 placeholder:text-gray-400 focus:border-fitorange focus:outline-none focus:ring-1 focus:ring-fitorange'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export default function UsernameGenerator() {
  const [form, setForm] = useState<LeadFormData>(EMPTY)
  const [results, setResults] = useState<string[] | null>(null)

  const isValid = useMemo(
    () =>
      form.fullName.trim().length > 0 &&
      isValidEmail(form.email) &&
      form.niches.length > 0 &&
      form.trainerTypes.length > 0,
    [form]
  )

  const set = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleGenerate = () => {
    if (!isValid) return
    const usernames = generateUsernames(form)
    setResults(usernames)
    void trackLead(form, usernames)
  }

  const handleReset = () => setResults(null)

  const handleCtaClick = () => {
    // Fire-and-forget; the anchor navigation proceeds regardless.
    void trackCtaClick(form)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <InstagramLogo size={20} className="shrink-0" />
        <h1 className="text-center text-[14px] font-bold text-fitorange leading-none">
          {results ? 'Your Usernames Are Ready' : 'Instagram Username Generator'}
        </h1>
      </div>

      <div className="min-h-[440px]">
        {!results ? (
          <form
            className="flex flex-col gap-[10px]"
            onSubmit={(e) => {
              e.preventDefault()
              handleGenerate()
            }}
          >
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-[13px] font-semibold text-gray-700"
              >
                Full Name <span className="text-fitorange">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                placeholder="e.g. Alex Rivera"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-[13px] font-semibold text-gray-700"
              >
                Email <span className="text-fitorange">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="you@email.com"
                className={inputClass}
              />
            </div>

            <MultiSelectDropdown
              id="niches"
              label="Fitness Niche/Specialty"
              options={FITNESS_NICHES}
              selected={form.niches}
              onChange={(v) => set('niches', v)}
              placeholder="Select your niche"
              required
            />

            <MultiSelectDropdown
              id="trainerTypes"
              label="Trainer Type"
              options={TRAINER_TYPES}
              selected={form.trainerTypes}
              onChange={(v) => set('trainerTypes', v)}
              placeholder="Select trainer type"
              required
            />

            <MultiSelectChips
              id="tones"
              label="Tone/Style"
              options={TONE_STYLES}
              selected={form.tones}
              onChange={(v) => set('tones', v)}
            />

            <div>
              <label
                htmlFor="keyword"
                className="mb-1 block text-[13px] font-semibold text-gray-700"
              >
                Keyword <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="keyword"
                type="text"
                value={form.keyword}
                onChange={(e) => set('keyword', e.target.value)}
                placeholder="Add a word you want in your username"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={[
                'mt-1 h-[46px] w-full rounded-lg text-[14px] font-bold transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-fitorange focus-visible:ring-offset-2',
                isValid
                  ? 'bg-fitorange text-white hover:bg-accent-hover cursor-pointer'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400',
              ].join(' ')}
            >
              🧠 Generate Usernames
            </button>
          </form>
        ) : (
          <div className="flex flex-col">
            <p className="mb-2.5 text-[13px] text-gray-600">
              Your Instagram usernames are ready
              <span aria-hidden="true">👇</span>
            </p>

            <div className="grid grid-cols-1 gap-2 min-420:grid-cols-2">
              {results.map((u) => (
                <UsernameCard key={u} username={u} />
              ))}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-3 h-[40px] w-full rounded-lg border border-gray-300 bg-white text-[13px] font-semibold text-gray-700 transition-colors hover:border-fitorange hover:text-fitorange focus:outline-none focus-visible:ring-2 focus-visible:ring-fitorange focus-visible:ring-offset-1"
            >
              ← Generate again
            </button>

            <CTASection onCtaClick={handleCtaClick} />
          </div>
        )}
      </div>
    </div>
  )
}
