import { motion, AnimatePresence } from 'framer-motion'
import type { Stats } from '../game/types'
import { getMood, MOOD_META } from '../game/engine'

interface AvatarProps {
  stats: Stats
  size?: number
  showThought?: boolean
  name?: string
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

export default function Avatar({ stats, size = 220, showThought = true, name }: AvatarProps) {
  const mood = getMood(stats)
  const meta = MOOD_META[mood]
  const t = stats.exhaustion / 100
  const e = stats.engagement / 100
  const w = stats.workload / 100

  // Facial parameters derived from meters
  const eyeRy = mood === 'collapsed' ? 1.2 : lerp(8, 3, clamp01((t - 0.15) / 0.8))
  const smile = Math.max(-1, Math.min(1, (e - 0.5) * 1.6 - (t - 0.3) * 1.1 - Math.max(0, w - 0.65)))
  const mouthY = 152
  const mouthD = `M 84 ${mouthY} Q 100 ${mouthY + smile * 14} 116 ${mouthY}`
  const worry = clamp01((w - 0.45) * 1.6 + (t - 0.35))
  const droop = clamp01((t - 0.55) * 2)
  const leftBrow = `M 70 ${104 + droop * 4} Q 80 ${98 - worry * 2} 90 ${101 - worry * 7 + droop * 2}`
  const rightBrow = `M 130 ${104 + droop * 4} Q 120 ${98 - worry * 2} 110 ${101 - worry * 7 + droop * 2}`
  const bagOpacity = clamp01((t - 0.3) * 1.4)
  const blush = clamp01((e - t) * 0.9)
  const greyOverlay = clamp01((t - 0.35) * 0.5)

  const bobDuration = mood === 'thriving' ? 3.6 : mood === 'stressed' ? 1.6 : mood === 'drained' ? 4.5 : 2.8
  const slump = mood === 'collapsed' ? 8 : mood === 'drained' ? 4 : 0

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      {/* Aura */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl"
        style={{ width: size * 0.85, height: size * 0.85, top: size * 0.05 }}
        animate={{
          backgroundColor: meta.color,
          opacity: [0.18, 0.32, 0.18],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          backgroundColor: { duration: 0.8 },
          opacity: { duration: bobDuration, repeat: Infinity },
          scale: { duration: bobDuration, repeat: Infinity },
        }}
      />

      <AnimatePresence mode="wait">
        {showThought && (
          <motion.div
            key={meta.thought}
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 mb-2 max-w-[240px] rounded-2xl border border-white/10 bg-ink-800/90 px-3 py-1.5 text-center text-xs italic text-slate-300 shadow-lg"
          >
            “{meta.thought}”
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-ink-800" />
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 200 220"
        width={size}
        height={size * 1.1}
        className="relative z-10 overflow-visible"
        role="img"
        aria-label={`${name ?? 'Employee'} avatar, currently ${meta.label.toLowerCase()}`}
      >
        <defs>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4c3d8f" />
            <stop offset="100%" stopColor="#2a2257" />
          </linearGradient>
          <radialGradient id="skin" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#f6d2b4" />
            <stop offset="100%" stopColor="#e3ad86" />
          </radialGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b2a4d" />
            <stop offset="100%" stopColor="#1d1428" />
          </linearGradient>
        </defs>

        <motion.g
          animate={{ y: [0, -3, 0], rotate: slump }}
          transition={{ y: { duration: bobDuration, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 1 } }}
          style={{ transformOrigin: '100px 200px' }}
        >
          {/* Body */}
          <path d="M 40 220 Q 44 176 100 172 Q 156 176 160 220 Z" fill="url(#shirt)" />
          <path d="M 86 172 L 100 192 L 114 172" fill="none" stroke="#f6d2b4" strokeWidth="0" />
          <path d="M 88 172 Q 100 186 112 172" fill="#e9b996" />
          {/* Lanyard + badge */}
          <path d="M 84 176 L 96 204 M 116 176 L 104 204" stroke="#2dd4bf" strokeWidth="2.5" fill="none" />
          <rect x="91" y="202" width="18" height="14" rx="3" fill="#e2e8f0" />
          <rect x="94" y="206" width="12" height="2" rx="1" fill="#94a3b8" />

          {/* Neck */}
          <rect x="90" y="156" width="20" height="20" rx="8" fill="#e3ad86" />

          {/* Head */}
          <circle cx="100" cy="118" r="50" fill="url(#skin)" />
          <circle cx="100" cy="118" r="50" fill="#6b7280" opacity={greyOverlay} />
          {/* Ears */}
          <ellipse cx="51" cy="122" rx="7" ry="10" fill="#e3ad86" />
          <ellipse cx="149" cy="122" rx="7" ry="10" fill="#e3ad86" />

          {/* Hair */}
          <path
            d="M 52 112 Q 48 66 96 64 Q 150 62 150 110 Q 140 88 118 86 Q 96 96 70 90 Q 58 98 52 112 Z"
            fill="url(#hair)"
          />
          <motion.path
            d="M 96 66 Q 104 54 114 62"
            stroke="#1d1428"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            animate={{ rotate: mood === 'stressed' || mood === 'drained' ? [0, 8, 0] : 0 }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ transformOrigin: '100px 66px' }}
          />

          {/* Brows */}
          <motion.path
            animate={{ d: leftBrow }}
            transition={{ duration: 0.6 }}
            stroke="#2b1d38"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <motion.path
            animate={{ d: rightBrow }}
            transition={{ duration: 0.6 }}
            stroke="#2b1d38"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eye bags */}
          <motion.g animate={{ opacity: bagOpacity }} transition={{ duration: 0.8 }}>
            <path d="M 72 128 Q 80 134 88 128" stroke="#8b5e7a" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 112 128 Q 120 134 128 128" stroke="#8b5e7a" strokeWidth="2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Eyes (with blink) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <motion.ellipse cx="80" cy="118" rx="7" animate={{ ry: eyeRy }} transition={{ duration: 0.6 }} fill="#1e1b2e" />
            <motion.ellipse cx="120" cy="118" rx="7" animate={{ ry: eyeRy }} transition={{ duration: 0.6 }} fill="#1e1b2e" />
            {eyeRy > 4 && (
              <>
                <circle cx="82.5" cy="115" r="2" fill="#fff" opacity="0.9" />
                <circle cx="122.5" cy="115" r="2" fill="#fff" opacity="0.9" />
              </>
            )}
          </motion.g>
          {/* Heavy eyelids when tired */}
          <motion.g animate={{ opacity: clamp01((t - 0.5) * 2.2) }} transition={{ duration: 0.8 }}>
            <path d="M 71 114 Q 80 109 89 114" stroke="#c98f6b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 111 114 Q 120 109 129 114" stroke="#c98f6b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Cheeks */}
          <motion.g animate={{ opacity: blush }} transition={{ duration: 0.8 }}>
            <ellipse cx="68" cy="138" rx="9" ry="5" fill="#fb7185" opacity="0.45" />
            <ellipse cx="132" cy="138" rx="9" ry="5" fill="#fb7185" opacity="0.45" />
          </motion.g>

          {/* Mouth */}
          <motion.path
            animate={{ d: mouthD }}
            transition={{ duration: 0.6 }}
            stroke="#7c2d3a"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Sweat drop when workload is high */}
          <AnimatePresence>
            {stats.workload >= 65 && mood !== 'collapsed' && (
              <motion.path
                key="sweat"
                d="M 146 92 Q 140 102 146 106 Q 152 102 146 92 Z"
                fill="#7dd3fc"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-4, 0, 10, 16] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeIn' }}
              />
            )}
          </AnimatePresence>
        </motion.g>

        {/* Zzz when exhausted */}
        <AnimatePresence>
          {stats.exhaustion >= 70 &&
            [0, 1, 2].map((i) => (
              <motion.text
                key={`z${i}`}
                x={150 + i * 10}
                y={70}
                fontSize={12 + i * 4}
                fontWeight={700}
                fill="#f43f6e"
                fontFamily="Outfit"
                initial={{ opacity: 0, y: 70 }}
                animate={{ opacity: [0, 1, 0], y: [70, 50 - i * 10, 30 - i * 14] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }}
              >
                z
              </motion.text>
            ))}
        </AnimatePresence>

        {/* Sparkles when thriving */}
        <AnimatePresence>
          {mood === 'thriving' &&
            [
              [40, 70],
              [160, 60],
              [168, 130],
              [30, 140],
            ].map(([x, y], i) => (
              <motion.path
                key={`s${i}`}
                d={`M ${x} ${y - 6} L ${x + 1.5} ${y - 1.5} L ${x + 6} ${y} L ${x + 1.5} ${y + 1.5} L ${x} ${y + 6} L ${x - 1.5} ${y + 1.5} L ${x - 6} ${y} L ${x - 1.5} ${y - 1.5} Z`}
                fill="#5eead4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.45 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            ))}
        </AnimatePresence>

        {/* Rain cloud when detached */}
        <AnimatePresence>
          {mood === 'detached' && (
            <motion.g key="cloud" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ellipse cx="100" cy="40" rx="30" ry="12" fill="#475569" />
              <ellipse cx="86" cy="34" rx="14" ry="11" fill="#475569" />
              <ellipse cx="110" cy="31" rx="16" ry="13" fill="#475569" />
              {[84, 98, 112].map((x, i) => (
                <motion.line
                  key={x}
                  x1={x}
                  x2={x - 2}
                  y1={54}
                  y2={60}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  animate={{ y: [0, 10], opacity: [1, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.div
        layout
        className="relative z-10 mt-1 flex items-center gap-2 rounded-full border border-white/10 bg-ink-800/80 px-3 py-1 text-xs font-semibold"
      >
        <motion.span
          className="h-2 w-2 rounded-full"
          animate={{ backgroundColor: meta.color, scale: [1, 1.4, 1] }}
          transition={{ scale: { duration: 1.6, repeat: Infinity } }}
        />
        <span className="text-slate-300">{name ? `${name} · ` : ''}</span>
        <span style={{ color: meta.color }}>{meta.label}</span>
      </motion.div>
    </div>
  )
}
