import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import type { StatKey, Stats } from '../game/types'
import { STAT_KEYS, STAT_META } from '../game/engine'
import { STAT_ICONS } from './meta'

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const rounded = useTransform(mv, (v) => Math.round(v))
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: 'easeOut' })
    return () => controls.stop()
  }, [value, mv])
  return <motion.span>{rounded}</motion.span>
}

function zoneFor(key: StatKey, v: number): { label: string; cls: string } {
  const good = STAT_META[key].goodWhenHigh ? v >= 60 : v <= 40
  const bad = STAT_META[key].goodWhenHigh ? v <= 30 : v >= 70
  if (bad) return { label: 'Critical', cls: 'text-rose-300 bg-rose-500/10' }
  if (good) return { label: 'Healthy', cls: 'text-teal-300 bg-teal-500/10' }
  return { label: 'Watch', cls: 'text-amber-300 bg-amber-500/10' }
}

interface StatBarsProps {
  stats: Stats
  deltas?: Partial<Stats> | null
  deltaKey?: string | number
}

export default function StatBars({ stats, deltas, deltaKey }: StatBarsProps) {
  return (
    <div className="space-y-3.5">
      {STAT_KEYS.map((key) => {
        const meta = STAT_META[key]
        const Icon = STAT_ICONS[key]
        const v = stats[key]
        const d = deltas?.[key] ?? 0
        const zone = zoneFor(key, v)
        const isGood = d !== 0 && (meta.goodWhenHigh ? d > 0 : d < 0)
        return (
          <div key={key} className="group" title={meta.description}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="grid h-7 w-7 place-items-center rounded-lg"
                  style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
                >
                  <Icon size={15} />
                </span>
                <span className="font-medium text-slate-200">{meta.label}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${zone.cls}`}>
                  {zone.label}
                </span>
              </div>
              <div className="relative flex items-center gap-1.5 font-display text-base font-semibold tabular-nums text-white">
                <AnimatePresence>
                  {d !== 0 && (
                    <motion.span
                      key={`${deltaKey}-${key}`}
                      initial={{ opacity: 0, y: 8, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`text-xs font-bold ${isGood ? 'text-teal-300' : 'text-rose-300'}`}
                    >
                      {d > 0 ? `+${d}` : d}
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatedNumber value={v} />
              </div>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/5">
              {/* threshold markers */}
              {[30, 50, 70].map((m) => (
                <span key={m} className="absolute top-0 h-full w-px bg-white/10" style={{ left: `${m}%` }} />
              ))}
              <motion.div
                className="relative h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
                  boxShadow: `0 0 16px ${meta.color}80`,
                }}
                initial={false}
                animate={{ width: `${v}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 18 }}
              >
                <span className="absolute inset-0 animate-pulse rounded-full bg-white/10" />
              </motion.div>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">{meta.goodWhenHigh ? 'Higher is better' : 'Lower is better'}</p>
          </div>
        )
      })}
    </div>
  )
}
