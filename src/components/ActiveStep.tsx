import type { Focus, Step } from '../types'
import { FocusHeader } from './FocusHeader'
import { FocusTimer } from './FocusTimer'

interface ActiveStepProps {
  focus: Focus
  step: Step
  onDone: () => void
  onSwitchTask: () => void
  onCompleteFocus: () => void
  onToggleHideTimer: () => void
}

export function ActiveStep({
  focus,
  step,
  onDone,
  onSwitchTask,
  onCompleteFocus,
  onToggleHideTimer,
}: ActiveStepProps) {
  const timerHidden = focus.hideTimer ?? false

  return (
    <div className="w-full max-w-lg mx-auto">
      <FocusHeader focus={focus} compact />

      <div className="text-center mb-8">
        <p className="text-sm text-muted mb-2">Working on</p>
        <p className="text-xl sm:text-2xl font-medium text-ink leading-snug">
          {step.task}
        </p>
      </div>

      <div className="mb-10">
        {timerHidden ? (
          <div className="text-center">
            <button
              type="button"
              onClick={onToggleHideTimer}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Show timer
            </button>
          </div>
        ) : (
          <>
            <FocusTimer focus={focus} />
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onToggleHideTimer}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                Hide timer
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onDone}
          className="flex-1 py-3.5 text-base font-medium text-white bg-done hover:bg-green-700 rounded-xl transition-colors"
        >
          Done
        </button>
        <button
          type="button"
          onClick={onSwitchTask}
          className="flex-1 py-3.5 text-base font-medium text-ink bg-surface border border-border hover:bg-stone-50 rounded-xl transition-colors"
        >
          Switch task
        </button>
      </div>

      <button
        type="button"
        onClick={onCompleteFocus}
        className="w-full mt-4 py-2.5 text-sm font-medium text-done hover:text-green-700 transition-colors"
      >
        Complete task
      </button>
    </div>
  )
}
