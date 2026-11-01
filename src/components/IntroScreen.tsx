import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Info, Trophy, MousePointerClick, LineChart, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { EndingId, Stats } from '../game/types'
import { ENDINGS, STAT_KEYS, STAT_META } from '../game/engine'
import Avatar from './Avatar'
import Disclaimer from './Disclaimer'
import { STAT_ICONS } from './meta'

const DEMO_STATES: Stats[] = [
  { workload: 30, exhaustion: 20, recovery: 80, engagement: 85 },
  { workload: 55, exhaustion: 40, recovery: 55, engagement: 60 },
  { workload: 80, exhaustion: 58, recovery: 40, engagement: 50 },
  { workload: 75, exhaustion: 82, recovery: 20, engagement: 40 },
  { workload: 60, exhaustion: 55, recovery: 35, engagement: 22 },
]

interface IntroScreenProps {
  defaultName: string
  unlocked: EndingId[]
  onStart: (name: string) => void
  onShowRules: () => void
}

export default function IntroScreen({ defaultName, unlocked, onStart, onShowRules }: IntroScreenProps) {
  const [name, setName] = useState(defaultName)
  const [demo, setDemo] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDemo((d) => (d + 1) % DEMO_STATES.length), 2600)
    return () => clearInterval(id)
  }, [])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 18 } },
  }

  return (
    <motion.main
      key="intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:pt-16"
    >
      <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300"
          >
            <CalendarDays size={13} className="text-violet-300" /> Interactive lesson · 7 workdays · ~10 minutes
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Burnout <span className="text-gradient">Simulator</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
            Step into the shoes of an employee during one very demanding sprint. Every choice — overtime, breaks, asking for
            help, switching off — shapes your workload, exhaustion, recovery, and engagement.
          </motion.p>

          <motion.form
            variants={item}
            className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              onStart(name)
            }}
          >
            <label htmlFor="player-name" className="sr-only">
              Employee name
            </label>
            <input
              id="player-name"
              value={name}
              maxLength={18}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name your employee"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none sm:max-w-[220px]"
            />
            <motion.button
              id="start-button"
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 px-6 py-3.5 font-semibold text-white shadow-xl shadow-fuchsia-900/30"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Start the week <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.form>
          <motion.button
            variants={item}
            id="intro-rules-button"
            type="button"
            onClick={onShowRules}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 underline-offset-4 transition hover:text-white hover:underline"
          >
            <Info size={14} /> See exactly how the rules work
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80, damping: 16 }}
          className="glass noise relative mx-auto flex w-full max-w-sm flex-col items-center rounded-[2rem] px-6 pb-6 pt-8"
        >
          <Avatar stats={DEMO_STATES[demo]} size={220} name={name || 'Alex'} />
          <div className="mt-5 grid w-full grid-cols-4 gap-2">
            {STAT_KEYS.map((k) => {
              const Icon = STAT_ICONS[k]
              return (
                <div key={k} className="flex flex-col items-center gap-1.5">
                  <div className="relative h-16 w-2.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="absolute bottom-0 w-full rounded-full"
                      style={{ backgroundColor: STAT_META[k].color }}
                      animate={{ height: `${DEMO_STATES[demo][k]}%` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    />
                  </div>
                  <Icon size={14} style={{ color: STAT_META[k].color }} />
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-500">Your employee reacts to every decision.</p>
        </motion.div>
      </section>

      {/* Meters */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={container}
        className="mt-16"
        aria-labelledby="meters-heading"
      >
        <motion.h2 variants={item} id="meters-heading" className="font-display text-2xl font-semibold text-white">
          Four Dynamic Simulation Metrics
        </motion.h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_KEYS.map((k) => {
            const Icon = STAT_ICONS[k]
            const meta = STAT_META[k]
            return (
              <motion.div
                key={k}
                variants={item}
                whileHover={{ y: -4 }}
                className="glass relative overflow-hidden rounded-2xl p-5"
              >
                <span
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl"
                  style={{ backgroundColor: meta.color }}
                />
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
                >
                  <Icon size={20} />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{meta.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{meta.description}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                  {meta.goodWhenHigh ? 'Target: High' : 'Target: Low'}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* How to play */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={container}
        className="mt-14 grid gap-3 md:grid-cols-3"
        aria-label="How to play"
      >
        {[
          { icon: MousePointerClick, title: 'Navigate 21 Scenarios', body: 'Tackle morning inboxes, mid-day crunches, and evening boundaries across a 7-day sprint.' },
          { icon: LineChart, title: 'Experience Systemic Feedback', body: 'Overtime and skipped breaks borrow against tomorrow, compounding exhaustion and reducing output.' },
          { icon: Trophy, title: 'Discover 8 Unique Outcomes', body: 'From “Thriving Together” to “The Burnout Spiral”, paired with research-informed reflections.' },
        ].map((s, i) => (
          <motion.div key={s.title} variants={item} className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <span className="font-display text-3xl font-bold text-white/10">0{i + 1}</span>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <s.icon size={16} className="text-violet-300" /> {s.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Endings collection */}
      <section className="mt-14" aria-labelledby="endings-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="endings-heading" className="font-display text-xl font-semibold text-white">
            Sprint Outcomes Discovered
          </h2>
          <span className="text-sm text-slate-400">
            {unlocked.length} / {Object.keys(ENDINGS).length}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.values(ENDINGS).map((e) => {
            const got = unlocked.includes(e.id)
            return (
              <div
                key={e.id}
                className={`relative overflow-hidden rounded-xl border p-3 text-sm ${
                  got ? 'border-white/10 bg-white/[0.04] text-white' : 'border-white/5 bg-white/[0.01] text-slate-600'
                }`}
              >
                {got && <div className={`absolute inset-0 bg-gradient-to-br ${e.gradient} opacity-60`} />}
                <span className="relative flex items-center gap-1.5 font-medium">
                  {got ? <Trophy size={13} className="text-amber-300" /> : <Lock size={13} />}
                  {got ? e.title : '???'}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="mt-12">
        <Disclaimer />
      </div>
    </motion.main>
  )
}
