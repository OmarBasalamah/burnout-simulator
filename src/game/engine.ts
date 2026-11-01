import type {
  Choice,
  ChoiceResult,
  DecisionLog,
  Ending,
  EndingId,
  RuleEvent,
  StatKey,
  Stats,
} from './types'

/* ------------------------------------------------------------------ */
/*  Transparent, fictional game rules. NOT clinical or diagnostic.    */
/* ------------------------------------------------------------------ */

export const STAT_KEYS: StatKey[] = ['workload', 'exhaustion', 'recovery', 'engagement']

export const INITIAL_STATS: Stats = {
  workload: 45,
  exhaustion: 25,
  recovery: 65,
  engagement: 70,
}

export const STAT_META: Record<
  StatKey,
  { label: string; color: string; goodWhenHigh: boolean; description: string }
> = {
  workload: {
    label: 'Workload',
    color: '#f5a524',
    goodWhenHigh: false,
    description: 'Your backlog of unfinished work. Rises as new work arrives; falls as you complete tasks or get help.',
  },
  exhaustion: {
    label: 'Exhaustion',
    color: '#f43f6e',
    goodWhenHigh: false,
    description: 'Accumulated fatigue and strain. High exhaustion makes you less productive and erodes engagement.',
  },
  recovery: {
    label: 'Recovery',
    color: '#2dd4bf',
    goodWhenHigh: true,
    description: 'Your energy reserves. Breaks, sleep, and detachment refill it; overtime drains it. Powers overnight recovery.',
  },
  engagement: {
    label: 'Engagement',
    color: '#a78bfa',
    goodWhenHigh: true,
    description: 'How connected and motivated you feel about your work. Support and progress raise it; chronic strain lowers it.',
  },
}

export const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** Productivity multiplier applied to workload *reductions*. */
export function getEfficiency(stats: Stats): { value: number; reasons: string[] } {
  let value = 1
  const reasons: string[] = []
  if (stats.exhaustion >= 70) {
    value *= 0.6
    reasons.push('Severe fatigue (Exhaustion ≥ 70): ×0.6 productivity')
  } else if (stats.exhaustion >= 50) {
    value *= 0.8
    reasons.push('Fatigue (Exhaustion ≥ 50): ×0.8 productivity')
  }
  if (stats.engagement <= 30) {
    value *= 0.85
    reasons.push('Low engagement (≤ 30): ×0.85 productivity')
  }
  return { value, reasons }
}

export function applyChoice(stats: Stats, choice: Choice): ChoiceResult {
  const { value: efficiency, reasons } = getEfficiency(stats)
  const after = { ...stats }
  const deltas: Stats = { workload: 0, exhaustion: 0, recovery: 0, engagement: 0 }
  for (const key of STAT_KEYS) {
    let d = choice.effects[key] ?? 0
    if (key === 'workload' && d < 0) d = Math.round(d * efficiency)
    after[key] = clamp(stats[key] + d)
    deltas[key] = after[key] - stats[key]
  }
  const notes: string[] = []
  if (efficiency < 1 && (choice.effects.workload ?? 0) < 0) {
    notes.push(...reasons)
  }
  return { before: stats, after, deltas, efficiency, notes }
}

function applyDelta(stats: Stats, deltas: Partial<Stats>): Stats {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    if (deltas[key]) next[key] = clamp(next[key] + (deltas[key] as number))
  }
  return next
}

/** Rules applied between days. Each fires based on the state at that moment. */
export function runOvernight(stats: Stats, incoming: number): { after: Stats; events: RuleEvent[] } {
  let s = { ...stats }
  const events: RuleEvent[] = []
  const push = (e: RuleEvent) => {
    const before = s
    s = applyDelta(s, e.deltas)
    // record the actual (clamped) change
    const real: Partial<Stats> = {}
    for (const k of STAT_KEYS) if (s[k] !== before[k]) real[k] = s[k] - before[k]
    events.push({ ...e, deltas: real })
  }

  if (s.workload >= 70) {
    push({
      id: 'rumination',
      label: 'Racing mind',
      description: 'Workload ≥ 70: unfinished work keeps you up thinking. +8 Exhaustion.',
      deltas: { exhaustion: 8 },
      tone: 'bad',
    })
  }
  if (s.recovery <= 25) {
    push({
      id: 'depleted',
      label: 'Running on fumes',
      description: 'Recovery ≤ 25: depleted reserves make everything harder. +6 Exhaustion.',
      deltas: { exhaustion: 6 },
      tone: 'bad',
    })
  }
  if (s.exhaustion >= 65) {
    push({
      id: 'cynicism',
      label: 'Cynicism creeps in',
      description: 'Exhaustion ≥ 65: chronic strain erodes motivation. −7 Engagement.',
      deltas: { engagement: -7 },
      tone: 'bad',
    })
  }
  if (s.workload <= 35) {
    push({
      id: 'progress',
      label: 'Sense of progress',
      description: 'Workload ≤ 35: feeling on top of things boosts motivation. +4 Engagement.',
      deltas: { engagement: 4 },
      tone: 'good',
    })
  }

  const ruminating = s.workload >= 70
  const relief = Math.round(s.recovery * 0.12)
  const gain = ruminating ? 4 : 8
  push({
    id: 'sleep',
    label: ruminating ? 'Restless sleep' : 'A night of sleep',
    description: `Sleep restores Recovery by +${gain}${ruminating ? ' (halved by a racing mind)' : ''} and reduces Exhaustion by 12% of your Recovery (−${relief}).`,
    deltas: { recovery: gain, exhaustion: -relief },
    tone: ruminating ? 'neutral' : 'good',
  })

  if (incoming > 0) {
    const strain = Math.round(incoming / 3)
    push({
      id: 'incoming',
      label: 'New work arrives',
      description: `The new day brings +${incoming} Workload and +${strain} Exhaustion from daily demands (⅓ of incoming work).`,
      deltas: { workload: incoming, exhaustion: strain },
      tone: 'neutral',
    })
  }

  return { after: s, events }
}

/* ------------------------------------------------------------------ */
/*  Avatar mood                                                       */
/* ------------------------------------------------------------------ */

export type Mood = 'thriving' | 'content' | 'stressed' | 'drained' | 'detached' | 'collapsed'

export function getMood(s: Stats): Mood {
  if (s.exhaustion >= 92) return 'collapsed'
  if (s.exhaustion >= 70) return 'drained'
  if (s.engagement <= 32) return 'detached'
  if (s.workload >= 68 || s.exhaustion >= 50) return 'stressed'
  if (s.exhaustion < 35 && s.engagement >= 65 && s.recovery >= 55) return 'thriving'
  return 'content'
}

export const MOOD_META: Record<Mood, { label: string; color: string; thought: string }> = {
  thriving: { label: 'Thriving', color: '#2dd4bf', thought: "I've got clear momentum and plenty of energy left." },
  content: { label: 'Steady', color: '#a78bfa', thought: 'Work is demanding, but completely manageable.' },
  stressed: { label: 'Strained', color: '#f5a524', thought: 'The pressure is mounting... I need to stay focused.' },
  drained: { label: 'Drained', color: '#f43f6e', thought: "I can't remember the last time I felt genuinely rested." },
  detached: { label: 'Disengaged', color: '#64748b', thought: 'Why does any of this even matter anymore?' },
  collapsed: { label: 'Exhausted', color: '#be123c', thought: "I can barely keep my eyes open right now..." },
}

/* ------------------------------------------------------------------ */
/*  Endings                                                           */
/* ------------------------------------------------------------------ */

export const ENDINGS: Record<EndingId, Ending> = {
  collapse: {
    id: 'collapse',
    title: 'Running on Empty',
    tagline: 'Exhaustion hit 100 before the week was out.',
    description:
      "You pushed until there was nothing left. In this simulation, you're forced to stop and take extended time off. Real exhaustion like this doesn't vanish overnight — recovery takes time, support, and often changes to the work itself.",
    tone: 'bad',
    gradient: 'from-rose-600/40 via-red-900/30 to-transparent',
    lessons: [
      'Overtime borrows from tomorrow — and the interest compounds.',
      'Fatigue reduces productivity, so pushing harder yields diminishing returns.',
      'Reaching out early is easier than recovering late.',
    ],
  },
  burnout: {
    id: 'burnout',
    title: 'The Burnout Spiral',
    tagline: 'You made it to the end — barely.',
    description:
      'The sprint is over, but your exhaustion is dangerously high. Each late night made the next day harder, and the recovery you needed kept getting postponed. This pattern mirrors the exhaustion dimension researchers describe in burnout.',
    tone: 'bad',
    gradient: 'from-rose-500/35 via-orange-900/25 to-transparent',
    lessons: [
      'Recovery is not a reward for finishing — it is what makes finishing possible.',
      'Psychological detachment after work is one of the strongest recovery levers.',
      'Unmanageable workload is an organizational problem, not a personal failing.',
    ],
  },
  detached: {
    id: 'detached',
    title: 'Checked Out',
    tagline: 'Still showing up. No longer showing up.',
    description:
      "Your engagement has collapsed. The work gets done (sometimes), but the meaning has drained out of it. Researchers call this cynicism or depersonalization — a protective distancing that often follows prolonged strain without support or recognition.",
    tone: 'bad',
    gradient: 'from-slate-500/35 via-slate-800/30 to-transparent',
    lessons: [
      'Cynicism is often a signal of unmet needs: control, recognition, fairness, community.',
      'Support and honest conversations rebuild connection to work.',
      'Masking strain can deepen disengagement over time.',
    ],
  },
  heroCost: {
    id: 'heroCost',
    title: 'Hero at a Cost',
    tagline: 'Everything shipped. You paid for it.',
    description:
      "Your backlog is impressively clear — your manager is thrilled. But your exhaustion tells a different story. This kind of 'heroics' is often rewarded in the short term and quietly unsustainable in the long term.",
    tone: 'mixed',
    gradient: 'from-amber-500/35 via-rose-900/25 to-transparent',
    lessons: [
      'High output today can mask accumulating strain.',
      'Asking for help or narrowing scope can deliver results without depleting you.',
      'A sustainable pace beats a heroic sprint over the long run.',
    ],
  },
  thriving: {
    id: 'thriving',
    title: 'Thriving Together',
    tagline: 'Demanding week. Strong team. Energy to spare.',
    description:
      "You protected your recovery, leaned on your team, and set boundaries when it mattered. Demands were high, but resources kept pace — exactly what the Job Demands–Resources model predicts for engagement.",
    tone: 'good',
    gradient: 'from-teal-400/35 via-violet-700/25 to-transparent',
    lessons: [
      'Social support is a job resource that buffers high demands.',
      'Boundaries and real breaks keep energy available for what matters.',
      'Speaking up helps change the system, not just your own week.',
    ],
  },
  sustainable: {
    id: 'sustainable',
    title: 'Sustainable Rhythm',
    tagline: 'Not perfect — but you could do this again next week.',
    description:
      "You found a workable balance between effort and recovery. Some tasks slipped, some evenings were short, but your energy and motivation are intact. That's what sustainable work looks like.",
    tone: 'good',
    gradient: 'from-violet-500/35 via-teal-800/25 to-transparent',
    lessons: [
      'Small recovery habits (breaks, detachment, sleep) add up across a week.',
      'Prioritizing is a skill: not everything has to be done now.',
      'Asking for support even more often could lighten the load further.',
    ],
  },
  snowed: {
    id: 'snowed',
    title: 'Snowed Under',
    tagline: 'You protected your energy — but the work piled up.',
    description:
      "You rested well, but the backlog kept growing. Recovery alone can't fix an unmanageable workload. Sustainable work needs both rest and changes to the demands themselves: prioritizing, negotiating scope, and getting help.",
    tone: 'mixed',
    gradient: 'from-amber-400/30 via-sky-900/25 to-transparent',
    lessons: [
      'Rest is essential, but it does not shrink the backlog on its own.',
      'Negotiating scope and asking for help are workload tools, not weaknesses.',
      'A growing backlog becomes a stressor of its own (rumination at night).',
    ],
  },
  treading: {
    id: 'treading',
    title: 'Treading Water',
    tagline: 'Afloat, but tired of swimming.',
    description:
      "You made it through without disaster, but you're not exactly energized either. Strain and recovery roughly cancelled out. A few more boundaries — or a bit more support — could tip this toward a sustainable rhythm.",
    tone: 'mixed',
    gradient: 'from-indigo-500/30 via-slate-800/25 to-transparent',
    lessons: [
      'Middle-ground weeks are common — and they are where small habits matter most.',
      'Look at which choices drained you most and which restored you.',
      'Support from others is often the most underused resource.',
    ],
  },
}

export function determineEnding(s: Stats, log: DecisionLog[]): EndingId {
  const supportCount = log.filter((l) => l.tags.includes('support')).length
  if (s.exhaustion >= 100) return 'collapse'
  if (s.exhaustion >= 75) return 'burnout'
  if (s.engagement <= 30) return 'detached'
  if (s.workload <= 35 && s.exhaustion >= 55) return 'heroCost'
  if (s.exhaustion <= 40 && s.engagement >= 70 && s.recovery >= 55 && s.workload <= 50 && supportCount >= 3)
    return 'thriving'
  if (s.exhaustion <= 50 && s.engagement >= 55 && s.recovery >= 45 && s.workload < 70) return 'sustainable'
  if (s.workload >= 70) return 'snowed'
  return 'treading'
}

/** Human-readable rule list for the Rules modal. */
export const RULES_TEXT: { title: string; items: string[] }[] = [
  {
    title: 'Four Core Simulation Meters (0–100)',
    items: [
      'Workload: Unfinished tasks and incoming demands. (Lower is healthier; reduces overnight anxiety)',
      'Exhaustion: Accumulated physical and cognitive strain. (Lower is healthier; reaching 100 triggers an involuntary shutdown)',
      'Recovery: Restorative capacity built through breaks, detachment, and sleep. (Higher is healthier; fuels overnight repair)',
      'Engagement: Motivation, purpose, and professional connection. (Higher is healthier; protected by recognition and autonomy)',
    ],
  },
  {
    title: 'Decision Mechanics & Feedback',
    items: [
      'Every choice applies immediate, transparent adjustments (displayed as ▲ and ▼ indicators on each card).',
      'Fatigue Penalty: When Exhaustion reaches 50+, task productivity decreases to 80% (×0.8). At 70+, productivity drops to 60% (×0.6).',
      'Disengagement Penalty: When Engagement drops to 30 or lower, productivity decreases by an additional 15% (×0.85).',
    ],
  },
  {
    title: 'Overnight Rules Sequence',
    items: [
      'Racing Mind: Workload ≥ 70 leads to perseverative rumination (+8 Exhaustion, overnight sleep recovery halved).',
      'Depleted Reserves: Ending the day with Recovery ≤ 25 incurs compounded strain (+6 Exhaustion).',
      'Cynicism & Erosion: Chronic Exhaustion (≥ 65) erodes motivation and psychological safety (−7 Engagement).',
      'Sense of Accomplishment: Maintaining manageable Workload (≤ 35) fosters positive momentum (+4 Engagement).',
      'Restorative Sleep: Yields +8 Recovery (+4 if ruminating), and relieves Exhaustion by 12% of current Recovery reserves.',
      'Morning Influx: Each new workday introduces sprint deliverables and baseline cognitive demands.',
    ],
  },
  {
    title: 'Sprint Outcomes (Evaluated in Order)',
    items: [
      'Running on Empty: Exhaustion reaches 100 at any point during the week.',
      'The Burnout Spiral: Final Exhaustion remains at 75 or higher.',
      'Checked Out: Final Engagement drops to 30 or lower.',
      'Hero at a Cost: Workload finished low (≤ 35), but achieved with severe exhaustion (≥ 55).',
      'Thriving Together: Exhaustion ≤ 40, Engagement ≥ 70, Recovery ≥ 55, Workload ≤ 50, and 3+ collaborative support choices.',
      'Sustainable Rhythm: Exhaustion ≤ 50, Engagement ≥ 55, Recovery ≥ 45, Workload < 70.',
      'Snowed Under: Workload ends at 70 or higher despite personal pacing.',
      'Treading Water: Pacing and demands roughly balanced without establishing a sustainable long-term pattern.',
    ],
  },
]
