import type { LeadFormData } from '../types'

/**
 * Deterministic, client-side Instagram username generator for fitness pros.
 * Generates 20 candidates internally and returns the best 10 unique ones.
 * All usernames are lowercase, <= 18 chars (excl. @), no numbers, no filler,
 * at most one dot/underscore, readable and brandable.
 */

const MAX_LEN = 18

// ---- Term dictionaries keyed by input, kept short + brandable ----

const NICHE_TERMS: Record<string, string[]> = {
  'Weight Loss': ['lean', 'shred', 'burn'],
  'Fat Loss': ['shred', 'lean', 'burn'],
  'Muscle Building': ['gains', 'build', 'muscle'],
  'Strength Training': ['strength', 'barbell', 'lift'],
  Yoga: ['flow', 'yoga', 'zen'],
  Pilates: ['pilates', 'core', 'align'],
  CrossFit: ['wod', 'cross', 'box'],
  Mobility: ['mobility', 'move', 'flex'],
  Nutrition: ['fuel', 'nutrition', 'nourish'],
  'Athletic Performance': ['athletic', 'perform', 'elite'],
  "Women's Fitness": ['strong', 'fit', 'empower'],
  'Senior Fitness': ['vital', 'active', 'ageless'],
  'Functional Training': ['functional', 'move', 'primal'],
}

const ROLE_TERMS: Record<string, string[]> = {
  'Personal Trainer': ['coach', 'trainer', 'pt'],
  'Online Coach': ['coach', 'online', 'coaching'],
  'Gym Owner': ['gym', 'coach', 'training'],
  'Fitness Influencer': ['fit', 'daily', 'life'],
  'Yoga Coach': ['yoga', 'coach', 'flow'],
  'Pilates Instructor': ['pilates', 'coach', 'studio'],
  'CrossFit Coach': ['coach', 'wod', 'box'],
  'Nutrition Coach': ['coach', 'fuel', 'nutrition'],
  'Strength Coach': ['coach', 'strength', 'lift'],
  'Group Fitness Instructor': ['coach', 'group', 'studio'],
}

// Tone influences which prefixes/suffixes we prefer.
const TONE_MODIFIERS: Record<string, { prefix: string[]; suffix: string[] }> = {
  Professional: { prefix: ['coach', 'train'], suffix: ['coaching', 'method', 'pro'] },
  Trendy: { prefix: ['the', 'go'], suffix: ['fit', 'moves', 'daily'] },
  Playful: { prefix: ['get', 'go'], suffix: ['moves', 'vibes', 'fitclub'] },
  Minimalist: { prefix: [''], suffix: ['fit', 'co', 'lab'] },
  Unique: { prefix: ['iam', 'the'], suffix: ['forge', 'lab', 'atlas'] },
}

const MOVEMENT_WORDS = ['moves', 'motion', 'flow', 'lift', 'forge']
const PERFORMANCE_WORDS = ['power', 'peak', 'elite', 'prime', 'pro']
const TRAIN_PREFIXES = ['trainwith', 'coach', 'train']

function clean(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z._]/g, '') // drop spaces, numbers, accents, special chars
    .replace(/[._]{2,}/g, (m) => m[0]) // collapse repeated separators
    .replace(/^[._]+|[._]+$/g, '') // trim leading/trailing separators
}

// Enforce a single separator max.
function hasTooManySeparators(s: string): boolean {
  const seps = (s.match(/[._]/g) || []).length
  return seps > 1
}

// Shorten intelligently: prefer trimming the suffix token, keep the name intact.
function fitLength(name: string, extra: string): string | null {
  let username = clean(name + extra)
  if (username.length <= MAX_LEN) return username

  // Try trimming the extra part progressively.
  let trimmed = extra
  while (trimmed.length > 2) {
    trimmed = trimmed.slice(0, -1)
    username = clean(name + trimmed)
    if (username.length <= MAX_LEN) return username
  }

  // Try just the name.
  username = clean(name)
  if (username.length >= 3 && username.length <= MAX_LEN) return username

  return null
}

function firstName(fullName: string): string {
  const parts = clean(fullName.split(/\s+/)[0] || '')
  return parts
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

export function generateUsernames(data: LeadFormData): string[] {
  const name = firstName(data.fullName) || 'coach'
  const keyword = clean(data.keyword || '')

  const niche = data.niches[0] || 'Strength Training'
  const role = data.trainerTypes[0] || 'Personal Trainer'
  const tone = data.tones[0] || 'Professional'

  const nicheTerms = NICHE_TERMS[niche] || ['fit']
  const roleTerms = ROLE_TERMS[role] || ['coach']
  const toneMod = TONE_MODIFIERS[tone] || TONE_MODIFIERS.Professional

  const candidates: string[] = []
  const push = (name0: string, extra: string) => {
    const u = fitLength(name0, extra)
    if (u && u.length >= 3 && !hasTooManySeparators(u)) candidates.push(u)
  }

  // Format mixes — vary by index across the available term arrays.
  for (let i = 0; i < 3; i++) {
    // coach + name
    push(pick(roleTerms, i), name)
    // name + niche
    push(name, pick(nicheTerms, i))
    // name + role
    push(name, pick(roleTerms, i))
    // train + name
    push(pick(TRAIN_PREFIXES, i), name)
    // name + performance word
    push(name, pick(PERFORMANCE_WORDS, i))
    // name + movement word
    push(name, pick(MOVEMENT_WORDS, i))
    // tone prefix + name
    push(pick(toneMod.prefix, i), name)
    // name + tone suffix
    push(name, pick(toneMod.suffix, i))
    // niche + name
    push(pick(nicheTerms, i), name)
  }

  // keyword + name / name + keyword when provided.
  if (keyword) {
    push(keyword, name)
    push(name, keyword)
    push(name, keyword.slice(0, 4))
  }

  // Dedupe while preserving order.
  const seen = new Set<string>()
  const unique: string[] = []
  for (const c of candidates) {
    if (!seen.has(c)) {
      seen.add(c)
      unique.push(c)
    }
  }

  // Rank: prefer readable lengths (6-14), containing the name, no separators.
  const ranked = unique
    .map((u) => {
      let score = 0
      if (u.includes(name) && name.length >= 2) score += 5
      if (u.length >= 6 && u.length <= 14) score += 4
      if (!/[._]/.test(u)) score += 3
      if (keyword && u.includes(keyword)) score += 2
      score += Math.max(0, 8 - Math.abs(10 - u.length))
      return { u, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.u)

  // Top 10 of up to 20 internal candidates.
  return ranked.slice(0, 10)
}
