import { useState, type FormEvent } from 'react'
import type { Focus } from '../types'
import { FocusHeader } from './FocusHeader'
import { FocusTimer } from './FocusTimer'

interface SmallStepPromptProps {
  focus: Focus
  onStart: (task: string) => void
  onCompleteFocus: () => void
  onAbandonFocus: () => void
  onSwitchTask: () => void
  onToggleHideTimer: () => void
}

export function SmallStepPrompt({
  focus,
  onStart,
  onCompleteFocus,
  onAbandonFocus,
  onSwitchTask,
  onToggleHideTimer,
}: SmallStepPromptProps) {
  const [task, setTask] = useState('')
  const timerHidden = focus.hideTimer ?? false

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!task.trim()) return
    onStart(task)
    setTask('')
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <FocusHeader focus={focus} />

      {!timerHidden && (
        <div className="mb-8">
          <FocusTimer focus={focus} />
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={onToggleHideTimer}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Hide timer
            </button>
          </div>
        </div>
      )}
      {timerHidden && (
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={onToggleHideTimer}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Show timer
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2 className="text-lg sm:text-xl font-medium text-center text-ink mb-4 leading-snug">
          What&apos;s the smallest thing you want to work on?
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. Write the first paragraph"
            autoFocus
            className="w-full px-4 py-3.5 text-lg bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
          />

          <button
            type="submit"
            disabled={!task.trim()}
            className="w-full py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Start
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onSwitchTask}
          className="w-full py-2.5 text-sm font-medium text-ink bg-surface border border-border hover:bg-stone-50 rounded-xl transition-colors"
        >
          Switch task
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCompleteFocus}
            className="flex-1 py-2.5 text-sm font-medium text-done bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
          >
            Complete task
          </button>
          <button
            type="button"
            onClick={onAbandonFocus}
            className="flex-1 py-2.5 text-sm font-medium text-muted bg-surface border border-border hover:bg-stone-50 rounded-xl transition-colors"
          >
            Abandon task
          </button>
        </div>
      </div>
    </div>
  )
}
