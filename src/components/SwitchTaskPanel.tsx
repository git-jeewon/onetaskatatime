import type { Focus } from '../types'

interface SwitchTaskPanelProps {
  currentFocusId: string
  todayFocuses: Focus[]
  onResume: (focusId: string) => void
  onNewTask: () => void
  onCancel: () => void
}

export function SwitchTaskPanel({
  currentFocusId,
  todayFocuses,
  onResume,
  onNewTask,
  onCancel,
}: SwitchTaskPanelProps) {
  const otherFocuses = todayFocuses.filter((f) => f.id !== currentFocusId)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-lg bg-surface rounded-2xl shadow-xl p-6 max-h-[80dvh] overflow-y-auto">
        <h2 className="text-lg font-medium text-ink mb-1">Switch task</h2>
        <p className="text-sm text-muted mb-5">
          Pick a task from today or start something new.
        </p>

        {otherFocuses.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Today&apos;s tasks
            </h3>
            <ul className="space-y-2">
              {otherFocuses.map((focus) => (
                <li key={focus.id}>
                  <button
                    type="button"
                    onClick={() => onResume(focus.id)}
                    className="w-full text-left p-3 border border-border rounded-xl hover:border-accent/50 transition-colors"
                  >
                    <p className="text-sm text-ink">{focus.task}</p>
                    {(focus.area || focus.subArea) && (
                      <p className="text-xs text-muted mt-0.5">
                        {[focus.area, focus.subArea]
                          .filter(Boolean)
                          .join(' → ')}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onNewTask}
          className="w-full py-3 text-base font-medium text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors"
        >
          Start new task
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-3 py-2.5 text-sm text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
