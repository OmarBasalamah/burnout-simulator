import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Snapshot, StatKey } from '../game/types'
import { STAT_KEYS, STAT_META } from '../game/engine'
import { STAT_ICONS } from './meta'

interface TooltipPayloadItem {
  dataKey?: string | number
  value?: number
  color?: string
  payload?: Snapshot
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null
  const snap = payload[0]?.payload
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-semibold text-white">{snap?.label}</p>
      {payload.map((p) => {
        const key = p.dataKey as StatKey
        return (
          <div key={key} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STAT_META[key].color }} />
              {STAT_META[key].label}
            </span>
            <span className="font-semibold tabular-nums text-white">{p.value}</span>
          </div>
        )
      })}
    </div>
  )
}

interface TrendChartProps {
  history: Snapshot[]
  height?: number
  title?: string
}

export default function TrendChart({ history, height = 220, title = 'Week at a glance' }: TrendChartProps) {
  const [visible, setVisible] = useState<Record<StatKey, boolean>>({
    workload: true,
    exhaustion: true,
    recovery: true,
    engagement: true,
  })

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Toggle chart series">
          {STAT_KEYS.map((k) => {
            const Icon = STAT_ICONS[k]
            const on = visible[k]
            return (
              <motion.button
                key={k}
                id={`toggle-${k}`}
                type="button"
                whileTap={{ scale: 0.92 }}
                aria-pressed={on}
                onClick={() => setVisible((v) => ({ ...v, [k]: !v[k] }))}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  on ? 'border-white/15 bg-white/[0.07] text-white' : 'border-white/5 text-slate-500 line-through'
                }`}
              >
                <Icon size={11} style={{ color: on ? STAT_META[k].color : undefined }} />
                {STAT_META[k].label}
              </motion.button>
            )
          })}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              {STAT_KEYS.map((k) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={STAT_META[k].color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={STAT_META[k].color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="short" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={12} />
            <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} />
            <ReferenceLine
              y={70}
              stroke="#f43f6e"
              strokeOpacity={0.35}
              strokeDasharray="4 4"
              label={{ value: 'danger zone', position: 'insideTopRight', fill: '#f43f6e', fontSize: 10, opacity: 0.7 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
            {STAT_KEYS.map((k) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stroke={STAT_META[k].color}
                strokeWidth={2.5}
                fill={`url(#grad-${k})`}
                hide={!visible[k]}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                animationDuration={700}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
