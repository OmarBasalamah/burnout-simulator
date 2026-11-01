import {
  BatteryCharging,
  Briefcase,
  Flame,
  Sparkles,
  Clock,
  Zap,
  Coffee,
  Users,
  Moon,
  ShieldCheck,
  Target,
  type LucideIcon,
} from 'lucide-react'
import type { StatKey, Tag } from '../game/types'

export const STAT_ICONS: Record<StatKey, LucideIcon> = {
  workload: Briefcase,
  exhaustion: Flame,
  recovery: BatteryCharging,
  engagement: Sparkles,
}

export const TAG_META: Record<Tag, { label: string; icon: LucideIcon; className: string; color: string }> = {
  overtime: { label: 'Overtime', icon: Clock, className: 'text-rose-300 bg-rose-500/10 border-rose-400/20', color: '#fb7185' },
  push: { label: 'Push through', icon: Zap, className: 'text-amber-300 bg-amber-500/10 border-amber-400/20', color: '#fbbf24' },
  break: { label: 'Break', icon: Coffee, className: 'text-sky-300 bg-sky-500/10 border-sky-400/20', color: '#7dd3fc' },
  support: { label: 'Support', icon: Users, className: 'text-violet-300 bg-violet-500/10 border-violet-400/20', color: '#c4b5fd' },
  recovery: { label: 'Recovery', icon: Moon, className: 'text-teal-300 bg-teal-500/10 border-teal-400/20', color: '#5eead4' },
  boundary: { label: 'Boundary', icon: ShieldCheck, className: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20', color: '#6ee7b7' },
  focus: { label: 'Focus', icon: Target, className: 'text-indigo-300 bg-indigo-500/10 border-indigo-400/20', color: '#a5b4fc' },
}
