import { ShieldAlert } from 'lucide-react'

interface DisclaimerProps {
  variant?: 'card' | 'footer'
}

export default function Disclaimer({ variant = 'card' }: DisclaimerProps) {
  if (variant === 'footer') {
    return (
      <footer className="mx-auto max-w-7xl px-5 pb-8 pt-4 text-center text-[11px] leading-relaxed text-slate-500">
        <p>
          <strong className="font-semibold text-slate-400">Educational simulation only.</strong> Burnout Simulator is not a
          clinical or diagnostic tool, and its meters are fictional game rules, not health scores. If you're struggling,
          please talk to a qualified health professional or a trusted person. In an emergency, contact local emergency
          services.
        </p>
      </footer>
    )
  }
  return (
    <div
      id="disclaimer"
      role="note"
      className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-4 text-left text-sm leading-relaxed text-amber-100/90"
    >
      <ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber-300" />
      <div>
        <p className="font-semibold text-amber-200">Educational, not diagnostic</p>
        <p className="mt-1 text-amber-100/75">
          This is an interactive learning experience. The meters use transparent, fictional game rules — they are not
          medical or psychological scores and can't tell you whether you or anyone else is experiencing burnout. If work
          stress is affecting your health, please reach out to a qualified professional.
        </p>
      </div>
    </div>
  )
}
