import { motion, AnimatePresence } from 'framer-motion'
import { Info, RotateCcw, Sun, Sunset, Moon, AlertTriangle, Activity } from 'lucide-react'
import { useEffect } from 'react'
import type { GameState } from '../game/useGame'
import type { Choice } from '../game/types'
import { DAYS, SLOT_NAMES } from '../game/scenarios'
import { getEfficiency } from '../game/engine'
import Avatar from './Avatar'
import StatBars from './StatBars'
import DecisionCard from './DecisionCard'
import OutcomePanel from './OutcomePanel'
import TrendChart from './TrendChart'
import { TAG_META } from './meta'

interface GameScreenProps {
  state: GameState
  onChoose: (c: Choice) => void
  onContinue: () => void
  onRestart: () => void
  onShowRules: () => void
}

const SLOT_ICONS = [Sun, Sunset, Moon]

export default function GameScreen({ state, onChoose, onContinue, onRestart, onShowRules }: GameScreenProps) {
  const dayInfo = DAYS[state.day - 1]
  const scenario = dayInfo.scenarios[state.slot]
  const SlotIcon = SLOT_ICONS[state.slot]
  const efficiency = getEfficiency(state.stats)
  const progress = ((state.day - 1) * 3 + state.slot + (state.pending ? 1 : 0)) / 21

  const continueLabel =
    state.stats.exhaustion >= 100
      ? 'Review Outcome'
      : state.slot < 2
        ? `Proceed to ${SLOT_NAMES[state.slot + 1]}`
        : state.day < DAYS.length
          ? `Complete Day ${state.day}`
          : 'Review Sprint Outcome'

  // Keyboard shortcuts: 1–3 to choose, Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.transition) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (!state.pending && ['1', '2', '3'].includes(e.key)) {
        const c = scenario.choices[Number(e.key) - 1]
        if (c) onChoose(c)
      } else if (state.pending && e.key === 'Enter') {
        e.preventDefault()
        onContinue()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.pending, state.transition, scenario, onChoose, onContinue])

  return (
    <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 text-white">
              <Activity size={16} />
            </span>
            <span className="hidden font-display text-lg font-bold text-white sm:inline">Burnout Simulator</span>
          </div>

          <nav aria-label="Week progress" className="mx-auto flex items-center gap-1.5 sm:gap-2">
            {DAYS.map((d) => {
              const done = d.day < state.day
              const current = d.day === state.day
              return (
                <div key={d.day} className="flex flex-col items-center gap-1">
                  <motion.div
                    layout
                    className={`grid h-7 place-items-center rounded-full text-[11px] font-bold transition-colors ${
                      current
                        ? 'w-14 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-900/50'
                        : done
                          ? 'w-7 bg-white/15 text-white'
                          : 'w-7 bg-white/[0.04] text-slate-500'
                    }`}
                    title={`Day ${d.day}: ${d.title}`}
                  >
                    {current ? `Day ${d.day}` : d.day}
                  </motion.div>
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              id="rules-button"
              type="button"
              onClick={onShowRules}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Info size={16} /> <span className="hidden md:inline">Rules</span>
            </button>
            <button
              id="restart-button"
              type="button"
              onClick={() => {
                if (confirm('Restart the week? Your progress will be lost.')) onRestart()
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <RotateCcw size={16} /> <span className="hidden md:inline">Restart</span>
            </button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500"
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-5 pt-6 lg:grid-cols-[340px_1fr]">
        {/* Left: employee */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass noise relative overflow-hidden rounded-3xl p-5">
            <div className="flex justify-center">
              <Avatar stats={state.stats} size={190} name={state.name} />
            </div>
            <div className="mt-5">
              <StatBars stats={state.stats} deltas={state.pending?.result.deltas} deltaKey={state.history.length} />
            </div>
            <AnimatePresence>
              {efficiency.value < 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-500/[0.07] p-3 text-xs text-rose-200">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Work Efficiency: {Math.round(efficiency.value * 100)}%</p>
                      {efficiency.reasons.map((r) => (
                        <p key={r} className="text-rose-200/75">
                          {r}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Right: scenario */}
        <section className="min-w-0 space-y-5" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 sm:p-7"
            >
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="relative flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-violet-200">
                  <SlotIcon size={13} /> Day {state.day} · {SLOT_NAMES[state.slot]}
                </span>
                <span className="text-slate-500">{dayInfo.title}</span>
                <span className="ml-auto flex gap-1">
                  {[0, 1, 2].map((s) => (
                    <span
                      key={s}
                      className={`h-1.5 w-6 rounded-full ${
                        s < state.slot || (s === state.slot && state.pending) ? 'bg-violet-400' : s === state.slot ? 'bg-violet-400/40' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </span>
              </div>
              {state.slot === 0 && (
                <p className="relative mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">Today: </span>
                  {dayInfo.event}
                </p>
              )}
              <h2 className="relative mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {scenario.title}
              </h2>
              <p className="relative mt-2 text-lg text-slate-300">{scenario.prompt}</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {state.pending ? (
              <OutcomePanel
                key={`outcome-${state.pending.choice.id}`}
                choice={state.pending.choice}
                result={state.pending.result}
                continueLabel={continueLabel}
                onContinue={onContinue}
              />
            ) : (
              <motion.div
                key={`choices-${scenario.id}`}
                className="grid gap-4 md:grid-cols-3"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                {scenario.choices.map((choice, i) => (
                  <DecisionCard key={choice.id} choice={choice} index={i} onSelect={onChoose} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
            <div className="glass rounded-3xl p-5">
              <TrendChart history={state.history} height={230} />
            </div>
            <div className="glass rounded-3xl p-5">
              <h2 className="font-display text-base font-semibold text-white">Sprint Decision Log</h2>
              {state.log.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Your choices and strategic trade-offs will appear here as the week unfolds.</p>
              ) : (
                <ol className="mt-3 max-h-[230px] space-y-2 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {[...state.log].reverse().map((l) => {
                      const T = TAG_META[l.tags[0]]
                      const TIcon = T.icon
                      return (
                        <motion.li
                          key={`${l.day}-${l.slot}`}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${T.color}1a`, color: T.color }}>
                            <TIcon size={13} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-slate-200">{l.choiceLabel}</p>
                            <p className="text-[11px] text-slate-500">
                              Day {l.day} · {SLOT_NAMES[l.slot]}
                            </p>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ol>
              )}
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  )
}
