export type StatKey = 'workload' | 'exhaustion' | 'recovery' | 'engagement'

export type Stats = Record<StatKey, number>

export type Tag = 'overtime' | 'push' | 'break' | 'support' | 'recovery' | 'boundary' | 'focus'

export type Slot = 0 | 1 | 2

export interface Insight {
  title: string
  body: string
  source: string
}

export interface Choice {
  id: string
  label: string
  description: string
  effects: Partial<Stats>
  tags: Tag[]
  insight: string // key into INSIGHTS
  feedback: string
}

export interface Scenario {
  id: string
  title: string
  prompt: string
  choices: Choice[]
}

export interface DayInfo {
  day: number
  title: string
  event: string
  incoming: number
  scenarios: [Scenario, Scenario, Scenario]
}

export interface ChoiceResult {
  before: Stats
  after: Stats
  deltas: Stats
  efficiency: number
  notes: string[]
}

export interface RuleEvent {
  id: string
  label: string
  description: string
  deltas: Partial<Stats>
  tone: 'good' | 'bad' | 'neutral'
}

export interface Snapshot {
  label: string
  short: string
  day: number
  workload: number
  exhaustion: number
  recovery: number
  engagement: number
}

export interface DecisionLog {
  day: number
  slot: Slot
  scenarioTitle: string
  choiceLabel: string
  tags: Tag[]
  deltas: Stats
}

export type EndingId =
  | 'collapse'
  | 'burnout'
  | 'detached'
  | 'heroCost'
  | 'thriving'
  | 'sustainable'
  | 'snowed'
  | 'treading'

export interface Ending {
  id: EndingId
  title: string
  tagline: string
  description: string
  tone: 'good' | 'mixed' | 'bad'
  gradient: string
  lessons: string[]
}
