/**
 * Optional HubSpot integration via the public Forms Submission API.
 * No SDK / server needed — submissions go straight to HubSpot from the browser.
 *
 * Configure with env vars (all optional — app works fully without them):
 *   VITE_HUBSPOT_PORTAL_ID        e.g. "12345678"
 *   VITE_HUBSPOT_LEAD_FORM_GUID   form GUID that captures the generated lead
 *   VITE_HUBSPOT_CTA_FORM_GUID    form GUID that captures the CTA click
 *
 * If any required value for a given call is missing, the call becomes a no-op
 * and resolves cleanly so it never blocks the user flow.
 */

const PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID
const LEAD_FORM_GUID = import.meta.env.VITE_HUBSPOT_LEAD_FORM_GUID
const CTA_FORM_GUID = import.meta.env.VITE_HUBSPOT_CTA_FORM_GUID

export const isHubSpotConfigured = Boolean(PORTAL_ID)

interface HubSpotField {
  name: string
  value: string
}

async function submitForm(
  formGuid: string | undefined,
  fields: HubSpotField[]
): Promise<boolean> {
  if (!PORTAL_ID || !formGuid) return false

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formGuid}`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: fields.filter((f) => f.value !== '' && f.value != null),
        context: {
          pageUri: typeof window !== 'undefined' ? window.location.href : '',
          pageName: 'Instagram Username Generator',
        },
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export { submitForm, LEAD_FORM_GUID, CTA_FORM_GUID }
