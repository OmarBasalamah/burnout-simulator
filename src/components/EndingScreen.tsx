import { motion } from 'framer-motion'
import { RotateCcw, Home, Lightbulb, BookMarked, TrendingUp, TrendingDown, Trophy, ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import type { GameState } from '../game/useGame'
import type { Tag } from '../game/types'
import { ENDINGS, INITIAL_STATS, STAT_KEYS, STAT_META } from '../game/engine'
import { REFERENCES } from '../game/insights'
import { SLOT_NAMES } from '../game/scenarios'
import Avatar from './Avatar'
import TrendChart from './TrendChart'
import Disclaimer from './Disclaimer'
import { STAT_ICONS, TAG_META } from './meta'

interface EndingScreenProps {
  state: GameState
  onRestart: () => void
  onHome: () => void
}

const TONE_LABEL = { good: 'Positive ending', mixed: 'Mixed ending', bad: 'Cautionary ending' } as const
const TONE_CLS = {
  good: 'bg-teal-500/15 text-teal-200 border-teal-400/30',
  mixed: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  bad: 'bg-rose-500/15 text-rose-200 border-rose-400/30',
} as const

export default function EndingScreen({ state, onRestart, onHome }: EndingScreenProps) {
  const ending = ENDINGS[state.endingId ?? 'treading']
  const [showRefs, setShowRefs] = useState(false)

  const tagCounts = useMemo(() => {
    const counts = Object.keys(TAG_META).reduce((acc, t) => ({ ...acc, [t]: 0 }), {} as Record<Tag, number>)
    state.log.forEach((l) => l.tags.forEach((t) => (counts[t] += 1)))
    return (Object.keys(counts) as Tag[]).map((t) => ({ tag: t, name: TAG_META[t].label, count: counts[t], color: TAG_META[t].color }))
  }, [state.log])

  const radarData = STAT_KEYS.map((k) => ({
    metric: STAT_META[k].label,
    Start: INITIAL_STATS[k],
    End: state.stats[k],
  }))

  const moments = useMemo(() => {
    if (!state.log.length) return null
    const worst = [...state.log].sort((a, b) => b.deltas.exhaustion - b.deltas.recovery - (a.deltas.exhaustion - a.deltas.recovery))[0]
    const best = [...state.log].sort((a, b) => a.deltas.exhaustion - a.deltas.recovery - (b.deltas.exhaustion - b.deltas.recovery))[0]
    return { worst, best }
  }, [state.log])

  const suggestions = useMemo(() => {
    const c = (t: Tag) => tagCounts.find((x) => x.tag === t)?.count ?? 0
    const out: string[] = []
    if (c('overtime') >= 3) out.push(`You chose overtime ${c('overtime')} times. Try a hard stop in the evening and watch what happens to Exhaustion overnight.`)
    if (c('support') <= 1) out.push('You rarely asked for support. Help from teammates and managers is one of the strongest workload levers in this game — and in research.')
    if (c('break') + c('recovery') <= 3) out.push('Few breaks or recovery choices. Even short breaks and genuine evenings off add up across a week.')
    if (c('boundary') <= 1) out.push('Try setting more boundaries: negotiating scope, declining optional meetings, or protecting evenings.')
    if (c('push') >= 6) out.push('“Pushing through” was your go-to. Notice how fatigue reduced your productivity later in the week.')
    if (state.stats.workload >= 70) out.push('Rest kept you going, but the backlog grew. Combine recovery with prioritizing and asking for help.')
    if (!out.length) out.push('You balanced demands and resources well. Try a different strategy to discover other endings and compare the graphs.')
    return out.slice(0, 3)
  }, [tagCounts, state.stats.workload])

  const daysPlayed = state.log.length ? state.log[state.log.length - 1].day : 1

  return (
    <motion.main
      key="ending"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl px-5 pb-10 pt-8"
    >
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${ending.gradient}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="relative grid items-center gap-6 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_CLS[ending.tone]}`}>
                <Trophy size={12} /> {TONE_LABEL[ending.tone]}
              </span>
              <span className="text-xs text-slate-400">
                {state.name} · {daysPlayed < 7 || state.endingId === 'collapse' ? `Ended on day ${daysPlayed}` : 'Completed all 7 days'}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="mt-4 font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl"
            >
              {ending.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 text-lg font-medium text-slate-200"
            >
              {ending.tagline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 max-w-2xl leading-relaxed text-slate-300"
            >
              {ending.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <motion.button
                id="play-again-button"
                type="button"
                onClick={onRestart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-ink-950 shadow-lg"
              >
                <RotateCcw size={17} /> Play again
              </motion.button>
              <button
                id="home-button"
                type="button"
                onClick={onHome}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
              >
                <Home size={17} /> Title screen
              </button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
            className="mx-auto"
          >
            <Avatar stats={state.stats} size={220} name={state.name} />
          </motion.div>
        </div>
      </section>

      {/* Final meters */}
      <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Final meters">
        {STAT_KEYS.map((k, i) => {
          const Icon = STAT_ICONS[k]
          const meta = STAT_META[k]
          const diff = state.stats[k] - INITIAL_STATS[k]
          const good = diff !== 0 && (meta.goodWhenHigh ? diff > 0 : diff < 0)
          return (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Icon size={15} style={{ color: meta.color }} /> {meta.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tabular-nums text-white">{state.stats[k]}</span>
                <span className={`text-sm font-semibold ${diff === 0 ? 'text-slate-500' : good ? 'text-teal-300' : 'text-rose-300'}`}>
                  {diff > 0 ? `+${diff}` : diff === 0 ? '±0' : diff}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Baseline: {INITIAL_STATS[k]}</p>
            </motion.div>
          )
        })}
      </section>

      {/* Charts */}
      <section className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <TrendChart history={state.history} height={300} title="Sprint Progression: Decision by Decision" />
          <p className="mt-2 text-xs text-slate-500">Markers labelled “N” indicate cumulative overnight recovery and workload adjustments.</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-base font-semibold text-white">Overall Profile: Start vs. End</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Start" dataKey="Start" stroke="#64748b" fill="#64748b" fillOpacity={0.2} />
                <Radar name="End" dataKey="End" stroke="#c084fc" fill="#c084fc" fillOpacity={0.35} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#0c0c16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-base font-semibold text-white">Behavioral Breakdown</h2>
          <div className="mt-2 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tagCounts} layout="vertical" margin={{ left: 10, right: 16 }}>
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={96} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#0c0c16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" name="Choices" radius={[0, 6, 6, 0]} animationDuration={900}>
                  {tagCounts.map((t) => (
                    <Cell key={t.tag} fill={t.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="font-display text-base font-semibold text-white">Pivotal Moments</h2>
          {moments && (
            <div className="mt-3 space-y-3">
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-300">
                  <TrendingDown size={13} /> Most draining choice
                </p>
                <p className="mt-1 font-semibold text-white">{moments.worst.choiceLabel}</p>
                <p className="text-xs text-slate-400">
                  Day {moments.worst.day} · {SLOT_NAMES[moments.worst.slot]} — Exhaustion {fmt(moments.worst.deltas.exhaustion)}, Recovery{' '}
                  {fmt(moments.worst.deltas.recovery)}
                </p>
              </div>
              <div className="rounded-2xl border border-teal-400/20 bg-teal-500/[0.06] p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300">
                  <TrendingUp size={13} /> Most restorative choice
                </p>
                <p className="mt-1 font-semibold text-white">{moments.best.choiceLabel}</p>
                <p className="text-xs text-slate-400">
                  Day {moments.best.day} · {SLOT_NAMES[moments.best.slot]} — Exhaustion {fmt(moments.best.deltas.exhaustion)}, Recovery{' '}
                  {fmt(moments.best.deltas.recovery)}
                </p>
              </div>
            </div>
          )}
          <h3 className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-white">
            <Lightbulb size={15} className="text-amber-300" /> Try next time
          </h3>
          <ul className="mt-2 space-y-2">
            {suggestions.map((s) => (
              <li key={s} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lessons */}
      <section className="mt-5 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-ink-900 to-teal-500/5 p-6">
        <h2 className="font-display text-xl font-semibold text-white">Key Educational Takeaways</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ending.lessons.map((l, i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300"
            >
              <span className="mb-2 block font-display text-2xl font-bold text-violet-300/60">0{i + 1}</span>
              {l}
            </motion.div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">
          Remember: the World Health Organization classifies burnout as an occupational phenomenon — resulting from chronic
          workplace stress that has not been successfully managed. While individual coping strategies are valuable, sustainable
          workloads, institutional support, psychological safety, and fair expectations remain organizational responsibilities.
        </p>
      </section>

      {/* References */}
      <section className="mt-5 glass rounded-3xl p-5">
        <button
          id="toggle-references"
          type="button"
          onClick={() => setShowRefs((s) => !s)}
          aria-expanded={showRefs}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="flex items-center gap-2 font-display text-base font-semibold text-white">
            <BookMarked size={16} className="text-violet-300" /> Scientific Foundations &amp; Research Citations
          </span>
          <motion.span animate={{ rotate: showRefs ? 180 : 0 }}>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.span>
        </button>
        <motion.div initial={false} animate={{ height: showRefs ? 'auto' : 0, opacity: showRefs ? 1 : 0 }} className="overflow-hidden">
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-400">
            {REFERENCES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </motion.div>
      </section>

      <div className="mt-5">
        <Disclaimer />
      </div>
    </motion.main>
  )
}

function fmt(n: number) {
  return n > 0 ? `+${n}` : `${n}`
}
