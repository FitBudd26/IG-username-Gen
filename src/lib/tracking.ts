import type { LeadFormData } from '../types'
import { TRACKING, CTA_URL, CTA_TEXT } from '../types'
import { submitForm, LEAD_FORM_GUID, CTA_FORM_GUID } from './hubspot'

/**
 * Fire-and-forget lead + CTA tracking through HubSpot.
 * Every function is safe to call regardless of whether HubSpot is configured,
 * and never throws — conversion must never be blocked by tracking failure.
 */

export async function trackLead(
  data: LeadFormData,
  usernames: string[]
): Promise<void> {
  try {
    await submitForm(LEAD_FORM_GUID, [
      { name: 'firstname', value: data.fullName },
      { name: 'email', value: data.email },
      { name: 'fitness_niches', value: data.niches.join(', ') },
      { name: 'trainer_types', value: data.trainerTypes.join(', ') },
      { name: 'tone_styles', value: data.tones.join(', ') },
      { name: 'keyword', value: data.keyword },
      { name: 'generated_usernames', value: usernames.join(', ') },
      { name: 'source', value: TRACKING.source },
      { name: 'campaign', value: TRACKING.campaign },
    ])
  } catch {
    /* never block */
  }
}

export async function trackCtaClick(data: LeadFormData): Promise<void> {
  try {
    await submitForm(CTA_FORM_GUID, [
      { name: 'email', value: data.email },
      { name: 'firstname', value: data.fullName },
      { name: 'cta_text', value: CTA_TEXT },
      { name: 'cta_url', value: CTA_URL },
      { name: 'source', value: TRACKING.source },
      { name: 'campaign', value: TRACKING.campaign },
      { name: 'medium', value: TRACKING.medium },
      {
        name: 'user_agent',
        value: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      {
        name: 'referrer',
        value: typeof document !== 'undefined' ? document.referrer : '',
      },
    ])
  } catch {
    /* never block */
  }
}
