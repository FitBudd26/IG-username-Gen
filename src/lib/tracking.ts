import type { LeadFormData } from '../types'
import { submitForm, LEAD_FORM_GUID, CTA_FORM_GUID } from './hubspot'

/**
 * Fire-and-forget lead + CTA tracking through HubSpot.
 *
 * Only email + name are sent, so the submission succeeds on any HubSpot form
 * without extra custom properties. Every function is safe to call whether or
 * not HubSpot is configured, and never throws — conversion must never be
 * blocked by a tracking failure.
 */

export async function trackLead(data: LeadFormData): Promise<void> {
  try {
    await submitForm(LEAD_FORM_GUID, [
      { name: 'email', value: data.email },
      { name: 'firstname', value: data.fullName.trim() },
    ])
  } catch {
    /* never block */
  }
}

export async function trackCtaClick(data: LeadFormData): Promise<void> {
  // No-op unless a dedicated CTA-click form GUID is configured.
  try {
    await submitForm(CTA_FORM_GUID, [
      { name: 'email', value: data.email },
      { name: 'firstname', value: data.fullName.trim() },
    ])
  } catch {
    /* never block */
  }
}
