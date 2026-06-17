import type { Session } from '../types'
import { TimerDisplay } from './TimerDisplay'

interface ActiveSessionProps {
  session: Session
  onDone: () => void
  onGiveUp: () => void
  onToggleHideTimer: () => void
}

export function ActiveSession({
  session,
  onDone,
  onGiveUp,
  onToggleHideTimer,
}: ActiveSessionProps) {
  const timerHidden = session.hideTimer ?? false
  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <p className="text-sm text-muted mb-6">Working on</p>

      <h2 className="text-2xl sm:text-3xl font-medium text-ink mb-2 leading-snug">
        {session.task}
      </h2>

      {(session.area || session.subArea) && (
        <p className="text-sm text-muted mb-8">
          {[session.area, session.subArea].filter(Boolean).join(' → ')}
        </p>
      )}

      <div className="mb-10">
        {timerHidden ? (
          <button
            type="button"
            onClick={onToggleHideTimer}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Show timer
          </button>
        ) : (
          <>
            <TimerDisplay session={session} />
            <button
              type="button"
              onClick={onToggleHideTimer}
              className="mt-4 text-sm text-muted hover:text-ink transition-colors"
            >
              Hide timer
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-3.5 text-base font-medium text-white bg-done hover:bg-green-700 rounded-xl transition-colors"
        >
          Done
        </button>
        <button
          type="button"
          onClick={onGiveUp}
          className="flex-1 py-3.5 text-base font-medium text-gave-up bg-surface border border-border hover:bg-stone-50 rounded-xl transition-colors"
        >
          Give up
        </button>
      </div>
    </div>
  )
}
