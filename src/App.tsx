import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame } from './game/useGame'
import type { EndingId } from './game/types'
import IntroScreen from './components/IntroScreen'
import GameScreen from './components/GameScreen'
import EndingScreen from './components/EndingScreen'
import DayTransition from './components/DayTransition'
import RulesModal from './components/RulesModal'
import Disclaimer from './components/Disclaimer'

const STORAGE_KEY = 'burnout_sim_unlocked_endings'

export default function App() {
  const { state, start, choose, next, nextDay, restart } = useGame()
  const [showRules, setShowRules] = useState(false)
  const [unlocked, setUnlocked] = useState<EndingId[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist newly discovered endings
  useEffect(() => {
    if (state.endingId && !unlocked.includes(state.endingId)) {
      setUnlocked((prev) => {
        const nextList = [...prev, state.endingId!]
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList))
        } catch {
          // ignore storage failure
        }
        return nextList
      })
    }
  }, [state.endingId, unlocked])

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-purple-500/30">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {state.screen === 'intro' && (
            <IntroScreen
              key="intro-screen"
              defaultName={state.name}
              unlocked={unlocked}
              onStart={start}
              onShowRules={() => setShowRules(true)}
            />
          )}

          {state.screen === 'playing' && (
            <GameScreen
              key="game-screen"
              state={state}
              onChoose={choose}
              onContinue={next}
              onRestart={restart}
              onShowRules={() => setShowRules(true)}
            />
          )}

          {state.screen === 'ending' && (
            <EndingScreen
              key="ending-screen"
              state={state}
              onRestart={restart}
              onHome={restart}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {state.transition && (
          <DayTransition
            key={`transition-${state.transition.fromDay}`}
            transition={state.transition}
            onNext={nextDay}
          />
        )}
      </AnimatePresence>

      <RulesModal open={showRules} onClose={() => setShowRules(false)} />

      {state.screen !== 'ending' && <Disclaimer variant="footer" />}
    </div>
  )
}
