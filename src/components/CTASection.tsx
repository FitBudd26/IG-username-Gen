import { CTA_URL, CTA_TEXT } from '../types'

interface Props {
  onCtaClick: () => void
}

/**
 * Compact social-proof CTA. Tracking happens in onCtaClick; the anchor still
 * navigates even if tracking fails (conversion is never blocked).
 */
export default function CTASection({ onCtaClick }: Props) {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-[13px] leading-snug text-gray-700">
        <span aria-hidden="true">⭐</span> 92% of personal trainers using FitBudd
        gave us 5 stars.
        <br />
        Build your own fitness app and grow your business.
      </p>
      <a
        href={CTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCtaClick}
        className="mt-2.5 flex h-[46px] w-full items-center justify-center rounded-lg bg-teal px-4 text-[14px] font-bold text-white transition-colors hover:bg-teal-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
      >
        {CTA_TEXT}
      </a>
    </div>
  )
}
