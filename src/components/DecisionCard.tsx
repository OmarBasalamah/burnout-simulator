import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Choice } from '../game/types'
import { STAT_KEYS, STAT_META } from '../game/engine'
import { STAT_ICONS, TAG_META } from './meta'

interface DecisionCardProps {
  choice: Choice
  index: number
  onSelect: (c: Choice) => void
  disabled?: boolean
}

const magnitude = (d: number) => (Math.abs(d) <= 4 ? 1 : Math.abs(d) <= 9 ? 2 : 3)

export default function DecisionCard({ choice, index, onSelect, disabled }: DecisionCardProps) {
  const primary = TAG_META[choice.tags[0]]
  const PrimaryIcon = primary.icon
  return (
    <motion.button
      id={`choice-${choice.id}`}
      type="button"
      disabled={disabled}
      onClick={() => onSelect(choice)}
      initial={{ opacity: 0, y: 24, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ delay: 0.08 * index, type: 'spring', stiffness: 160, damping: 20 }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      className="group glass noise relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-5 text-left transition-colors hover:border-white/20 disabled:cursor-not-allowed"
      style={{ perspective: 800 }}
    >
      {/* hover glow */}
      <span
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ backgroundColor: primary.color }}
      />

      <div className="relative mb-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {choice.tags.map((tag) => {
            const T = TAG_META[tag]
            const TIcon = T.icon
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${T.className}`}
              >
                <TIcon size={11} /> {T.label}
              </span>
            )
          })}
        </div>
        <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
          {index + 1}
        </kbd>
      </div>

      <div className="relative flex items-start gap-3">
        <span
          className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
          style={{ backgroundColor: `${primary.color}1a`, color: primary.color }}
        >
          <PrimaryIcon size={20} />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-white">{choice.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{choice.description}</p>
        </div>
      </div>

      <div className="relative mt-auto pt-4">
        <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
          {STAT_KEYS.filter((k) => choice.effects[k]).map((k) => {
            const d = choice.effects[k] as number
            const meta = STAT_META[k]
            const Icon = STAT_ICONS[k]
            const good = meta.goodWhenHigh ? d > 0 : d < 0
            const Arrow = d > 0 ? ChevronUp : ChevronDown
            return (
              <span
                key={k}
                title={`${meta.label} ${d > 0 ? '+' : ''}${d}`}
                className={`inline-flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-xs ${
                  good ? 'bg-teal-500/10 text-teal-300' : 'bg-rose-500/10 text-rose-300'
                }`}
              >
                <Icon size={12} className="mr-0.5" style={{ color: meta.color }} />
                {Array.from({ length: magnitude(d) }).map((_, i) => (
                  <Arrow key={i} size={12} strokeWidth={3} className="-mx-[3px]" />
                ))}
              </span>
            )
          })}
        </div>
      </div>
    </motion.button>
  )
}
