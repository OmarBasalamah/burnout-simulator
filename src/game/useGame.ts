import { useReducer } from 'react'
import type {
  Choice,
  ChoiceResult,
  DecisionLog,
  EndingId,
  RuleEvent,
  Slot,
  Snapshot,
  Stats,
} from './types'
import { INITIAL_STATS, applyChoice, determineEnding, runOvernight } from './engine'
import { DAYS, SLOT_NAMES, SLOT_SHORT } from './scenarios'

export type Screen = 'intro' | 'playing' | 'ending'

export interface Transition {
  fromDay: number
  events: RuleEvent[]
  before: Stats
  after: Stats
}

export interface GameState {
  screen: Screen
  name: string
  day: number
  slot: Slot
  stats: Stats
  history: Snapshot[]
  log: DecisionLog[]
  pending: { choice: Choice; result: ChoiceResult } | null
  transition: Transition | null
  endingId: EndingId | null
}

type Action =
  | { type: 'START'; name: string }
  | { type: 'CHOOSE'; choice: Choice }
  | { type: 'CONTINUE' }
  | { type: 'NEXT_DAY' }
  | { type: 'RESTART' }

const snap = (label: string, short: string, day: number, s: Stats): Snapshot => ({
  label,
  short,
  day,
  ...s,
})

const initialState: GameState = {
  screen: 'intro',
  name: 'Alex',
  day: 1,
  slot: 0,
  stats: INITIAL_STATS,
  history: [],
  log: [],
  pending: null,
  transition: null,
  endingId: null,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START':
      return {
        ...initialState,
        screen: 'playing',
        name: action.name.trim() || 'Alex',
        history: [snap('Start of week', 'Start', 1, INITIAL_STATS)],
      }

    case 'CHOOSE': {
      if (state.pending || state.transition) return state
      const scenario = DAYS[state.day - 1].scenarios[state.slot]
      const result = applyChoice(state.stats, action.choice)
      return {
        ...state,
        stats: result.after,
        pending: { choice: action.choice, result },
        history: [
          ...state.history,
          snap(
            `Day ${state.day} · ${SLOT_NAMES[state.slot]}`,
            `D${state.day} ${SLOT_SHORT[state.slot]}`,
            state.day,
            result.after,
          ),
        ],
        log: [
          ...state.log,
          {
            day: state.day,
            slot: state.slot,
            scenarioTitle: scenario.title,
            choiceLabel: action.choice.label,
            tags: action.choice.tags,
            deltas: result.deltas,
          },
        ],
      }
    }

    case 'CONTINUE': {
      if (!state.pending) return state
      const base = { ...state, pending: null }
      if (state.stats.exhaustion >= 100) {
        return { ...base, screen: 'ending', endingId: 'collapse' }
      }
      if (state.slot < 2) {
        return { ...base, slot: (state.slot + 1) as Slot }
      }
      if (state.day >= DAYS.length) {
        return { ...base, screen: 'ending', endingId: determineEnding(state.stats, state.log) }
      }
      const nextDay = DAYS[state.day]
      const { after, events } = runOvernight(state.stats, nextDay.incoming)
      return {
        ...base,
        stats: after,
        transition: { fromDay: state.day, events, before: state.stats, after },
        history: [...state.history, snap(`Night ${state.day} → Day ${state.day + 1}`, `N${state.day}`, state.day, after)],
      }
    }

    case 'NEXT_DAY': {
      if (!state.transition) return state
      if (state.stats.exhaustion >= 100) {
        return { ...state, transition: null, screen: 'ending', endingId: 'collapse' }
      }
      return { ...state, transition: null, day: state.day + 1, slot: 0 }
    }

    case 'RESTART':
      return { ...initialState, name: state.name }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return {
    state,
    start: (name: string) => dispatch({ type: 'START', name }),
    choose: (choice: Choice) => dispatch({ type: 'CHOOSE', choice }),
    next: () => dispatch({ type: 'CONTINUE' }),
    nextDay: () => dispatch({ type: 'NEXT_DAY' }),
    restart: () => dispatch({ type: 'RESTART' }),
  }
}
