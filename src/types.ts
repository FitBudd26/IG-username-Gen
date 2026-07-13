export interface LeadFormData {
  fullName: string
  email: string
  niches: string[]
  trainerTypes: string[]
  tones: string[]
  keyword: string
}

export const TRACKING = {
  source: 'instagram_username_generator',
  campaign: 'lead_conversion',
  medium: 'tool_cta',
} as const

export const CTA_URL =
  'https://dashboard.fitbudd.com/signup?utm_source=instagram_username_generator&utm_medium=tool_cta&utm_campaign=lead_conversion'

export const CTA_TEXT = 'Start Free Trial'

export const FITNESS_NICHES = [
  'Weight Loss',
  'Fat Loss',
  'Muscle Building',
  'Strength Training',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Mobility',
  'Nutrition',
  'Athletic Performance',
  "Women's Fitness",
  'Senior Fitness',
  'Functional Training',
]

export const TRAINER_TYPES = [
  'Personal Trainer',
  'Online Coach',
  'Gym Owner',
  'Fitness Influencer',
  'Yoga Coach',
  'Pilates Instructor',
  'CrossFit Coach',
  'Nutrition Coach',
  'Strength Coach',
  'Group Fitness Instructor',
]

export const TONE_STYLES = [
  'Professional',
  'Trendy',
  'Playful',
  'Minimalist',
  'Unique',
]
