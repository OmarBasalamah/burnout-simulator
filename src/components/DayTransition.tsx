import { motion } from 'framer-motion'
import { Moon, Sunrise, ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useEffect } from 'react'
import type { Transition } from '../game/useGame'
import { STAT_KEYS, STAT_META } from '../game/engine'
import { DAYS } from '../game/scenarios'
import { STAT_ICONS } from './meta'

interface DayTransitionProps {
  transition: Transition
  onNext: () => void
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 60,
  d: 1.5 + ((i * 7) % 5) / 2,
  s: (i % 3) + 1,
}))

export default function DayTransition({ transition, onNext }: DayTransitionProps) {
  const next = DAYS[transition.fromDay]
  const collapsed = transition.after.exhaustion >= 100
  const evCount = transition.events.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext])

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#05050b]/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="night-title"
    >
      {/* stars */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        {STARS.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }}
            animate={{ opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: s.d, repeat: Infinity, delay: i * 0.07 }}
          />
        ))}
        <div className="absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-indigo-300 to-violet-500 text-ink-950 shadow-[0_0_60px_rgba(129,140,248,0.6)]"
        >
          <Moon size={28} />
        </motion.div>
        <motion.h2
          id="night-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center font-display text-3xl font-bold text-white sm:text-4xl"
        >
          Night {transition.fromDay}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-center text-sm text-slate-400"
        >
          Overnight simulation rules now process the cumulative effects of your day:
        </motion.p>

        <ul className="mt-8 space-y-2.5">
          {transition.events.map((ev, i) => (
            <motion.li
              key={ev.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.35, type: 'spring', stiffness: 140, damping: 18 }}
              className={`flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                ev.tone === 'good'
                  ? 'border-teal-400/20 bg-teal-500/[0.06]'
                  : ev.tone === 'bad'
                    ? 'border-rose-400/20 bg-rose-500/[0.06]'
                    : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                    ev.tone === 'good'
                      ? 'bg-teal-500/15 text-teal-300'
                      : ev.tone === 'bad'
                        ? 'bg-rose-500/15 text-rose-300'
                        : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {ev.tone === 'good' ? <TrendingUp size={14} /> : ev.tone === 'bad' ? <TrendingDown size={14} /> : <Minus size={14} />}
                </span>
                <div>
                  <p className="font-semibold text-white">{ev.label}</p>
                  <p className="text-xs text-slate-400">{ev.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5 pl-10 sm:pl-0">
                {STAT_KEYS.filter((k) => ev.deltas[k]).map((k) => {
                  const d = ev.deltas[k] as number
                  const good = STAT_META[k].goodWhenHigh ? d > 0 : d < 0
                  const Icon = STAT_ICONS[k]
                  return (
                    <span
                      key={k}
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold tabular-nums ${
                        good ? 'bg-teal-500/10 text-teal-300' : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      <Icon size={11} style={{ color: STAT_META[k].color }} />
                      {d > 0 ? `+${d}` : d}
                    </span>
                  )
                })}
              </div>
            </motion.li>
          ))}
        </ul>

        {/* before -> after */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + evCount * 0.35 }}
          className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {STAT_KEYS.map((k) => {
            const Icon = STAT_ICONS[k]
            return (
              <div key={k} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Icon size={11} style={{ color: STAT_META[k].color }} /> {STAT_META[k].label}
                </div>
                <div className="font-display text-lg font-semibold tabular-nums text-white">
                  <span className="text-slate-500">{transition.before[k]}</span>
                  <span className="mx-1.5 text-slate-600">→</span>
                  {transition.after[k]}
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* next day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + evCount * 0.35, type: 'spring', stiffness: 100, damping: 18 }}
          className={`mt-8 overflow-hidden rounded-2xl border p-6 ${
            collapsed
              ? 'border-rose-500/30 bg-gradient-to-br from-rose-600/20 to-transparent'
              : 'border-amber-300/20 bg-gradient-to-br from-amber-400/15 via-rose-400/5 to-transparent'
          }`}
        >
          {collapsed ? (
            <>
              <p className="font-display text-2xl font-semibold text-rose-200">Critical Exhaustion (100/100)</p>
              <p className="mt-2 text-sm text-slate-300">
                Your exhaustion reached maximum capacity overnight. Your body has entered involuntary rest, ending the sprint.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                <Sunrise size={14} /> Day {next.day} of 7
              </div>
              <p className="mt-2 font-display text-2xl font-semibold text-white">{next.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{next.event}</p>
            </>
          )}
          <motion.button
            id="next-day-button"
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-ink-950 shadow-lg"
          >
            {collapsed ? 'Review Final Outcome' : `Begin Day ${next.day}`} <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
