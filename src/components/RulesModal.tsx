import { motion, AnimatePresence } from 'framer-motion'
import { X, Scale } from 'lucide-react'
import { useEffect } from 'react'
import { RULES_TEXT } from '../game/engine'

interface RulesModalProps {
  open: boolean
  onClose: () => void
}

export default function RulesModal({ open, onClose }: RulesModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Scale size={20} />
                </span>
                <div>
                  <h2 id="rules-title" className="font-display text-xl font-semibold text-white">
                    Simulation Mechanics &amp; Rules
                  </h2>
                  <p className="text-xs text-slate-400">All calculations and transitions use fully transparent, fictional simulation rules.</p>
                </div>
              </div>
              <button
                id="close-rules"
                type="button"
                onClick={onClose}
                aria-label="Close rules"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {RULES_TEXT.map((section) => (
                <section key={section.title}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">{section.title}</h3>
                  <ul className="space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <p className="mt-6 rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3 text-xs leading-relaxed text-amber-200/90">
              These meters are simplified game mechanics inspired by research concepts (e.g., the Job Demands–Resources model
              and recovery research). They are not validated psychological measures and cannot assess anyone's health.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
