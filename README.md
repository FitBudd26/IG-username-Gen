# Instagram Username Generator for Fitness Professionals

A compact, embeddable lead-magnet tool for FitBudd. Collects mandatory lead info,
then instantly generates unique, brandable Instagram usernames.

Built with **React + TypeScript + Tailwind CSS + Vite**. Optional **HubSpot**
lead/CTA tracking. iframe-resizer child script included for auto-height embeds.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## HubSpot tracking (optional)

Copy `.env.example` to `.env` and fill in:

| Var | Purpose |
| --- | --- |
| `VITE_HUBSPOT_PORTAL_ID` | Your HubSpot portal/hub ID |
| `VITE_HUBSPOT_LEAD_FORM_GUID` | Form GUID for captured leads |
| `VITE_HUBSPOT_CTA_FORM_GUID` | Form GUID for CTA clicks |

Submissions use HubSpot's public Forms Submission API directly from the browser
(no server needed). If env vars are absent, tracking is skipped and the app works
normally. Tracking never blocks generation or the CTA navigation.

Recommended HubSpot form fields:

- **Lead form:** `firstname`, `email`, `fitness_niches`, `trainer_types`,
  `tone_styles`, `keyword`, `generated_usernames`, `source`, `campaign`
- **CTA form:** `email`, `firstname`, `cta_text`, `cta_url`, `source`,
  `campaign`, `medium`, `user_agent`, `referrer`

Create the custom contact properties in HubSpot before mapping them on the forms.

## Embedding

Build, host `dist/`, then embed:

```html
<iframe
  src="https://YOUR_HOST/index.html"
  style="width:100%;max-width:536px;border:0;"
  height="580"
  title="Instagram Username Generator"
></iframe>
<script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2"></script>
<script>iframeResize({ license: 'GPLv3' }, 'iframe');</script>
```

The child script is already included in `index.html`, so height auto-sizes when
the parent page initializes iframe-resizer. The `580` height is a fallback.
