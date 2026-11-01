import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, AlertTriangle } from 'lucide-react'
import type { Choice, ChoiceResult } from '../game/types'
import { STAT_KEYS, STAT_META } from '../game/engine'
import { INSIGHTS } from '../game/insights'
import { STAT_ICONS, TAG_META } from './meta'

interface OutcomePanelProps {
  choice: Choice
  result: ChoiceResult
  continueLabel: string
  onContinue: () => void
}

export default function OutcomePanel({ choice, result, continueLabel, onContinue }: OutcomePanelProps) {
  const insight = INSIGHTS[choice.insight]
  const tag = TAG_META[choice.tags[0]]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      className="grid gap-4 lg:grid-cols-5"
    >
      <div className="glass noise relative overflow-hidden rounded-2xl p-6 lg:col-span-3">
        <span
          className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: tag.color }}
        />
        <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Choice Made</p>
        <h3 className="relative mt-1 font-display text-2xl font-semibold text-white">{choice.label}</h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mt-3 text-base leading-relaxed text-slate-300"
        >
          {choice.feedback}
        </motion.p>

        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STAT_KEYS.map((k, i) => {
            const d = result.deltas[k]
            const meta = STAT_META[k]
            const Icon = STAT_ICONS[k]
            const good = d !== 0 && (meta.goodWhenHigh ? d > 0 : d < 0)
            return (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className={`rounded-xl border px-3 py-2.5 ${
                  d === 0
                    ? 'border-white/5 bg-white/[0.02]'
                    : good
                      ? 'border-teal-400/20 bg-teal-500/[0.07]'
                      : 'border-rose-400/20 bg-rose-500/[0.07]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Icon size={12} style={{ color: meta.color }} /> {meta.label}
                </div>
                <div
                  className={`font-display text-xl font-bold tabular-nums ${
                    d === 0 ? 'text-slate-500' : good ? 'text-teal-300' : 'text-rose-300'
                  }`}
                >
                  {d > 0 ? `+${d}` : d === 0 ? '±0' : d}
                </div>
              </motion.div>
            )
          })}
        </div>

        {result.notes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mt-4 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-500/[0.07] p-3 text-xs text-amber-200"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Diminished Task Efficiency</p>
              {result.notes.map((n) => (
                <p key={n} className="text-amber-200/80">
                  {n}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          id="continue-button"
          type="button"
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:shadow-violet-700/50"
        >
          {continueLabel} <ArrowRight size={18} />
          <kbd className="ml-1 hidden rounded border border-white/30 px-1 text-[10px] font-normal sm:inline">Enter</kbd>
        </motion.button>
      </div>

      {insight && (
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 20 }}
          className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.12] via-ink-800/60 to-teal-500/[0.06] p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <BookOpen size={14} /> Evidence &amp; Research Context
          </div>
          <h4 className="mt-3 font-display text-xl font-semibold text-white">{insight.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{insight.body}</p>
          <p className="mt-4 text-xs text-slate-500">
            Reference: <span className="text-slate-400">{insight.source}</span>
          </p>
        </motion.aside>
      )}
    </motion.div>
  )
}
