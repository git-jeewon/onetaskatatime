import type { Focus, Step, AppData } from '../types'
import { getStepsForFocus } from '../storage'
import { formatDuration, formatTime, sessionDuration } from '../utils/time'

interface TodayHistoryProps {
  data: AppData
}

function StepStatusBadge({ status }: { status: Step['status'] }) {
  if (status === 'done') {
    return (
      <span className="text-xs font-medium text-done bg-green-50 px-2 py-0.5 rounded-full">
        Done
      </span>
    )
  }
  return (
    <span className="text-xs font-medium text-muted bg-stone-100 px-2 py-0.5 rounded-full">
      Switched
    </span>
  )
}

function FocusStatusBadge({ status }: { status: Focus['status'] }) {
  if (status === 'done') {
    return (
      <span className="text-xs font-medium text-done bg-green-50 px-2 py-0.5 rounded-full">
        Completed
      </span>
    )
  }
  return (
    <span className="text-xs font-medium text-muted bg-stone-100 px-2 py-0.5 rounded-full">
      Abandoned
    </span>
  )
}

export function TodayHistory({ data }: TodayHistoryProps) {
  const today = new Date().toDateString()
  const endedFocuses = data.focuses.filter(
    (f) =>
      f.status !== 'active' &&
      new Date(f.startedAt).toDateString() === today,
  )

  if (endedFocuses.length === 0) return null

  return (
    <section className="w-full max-w-lg mx-auto mt-16 pt-8 border-t border-border">
      <h3 className="text-sm font-medium text-muted mb-4">Today&apos;s history</h3>

      <ul className="space-y-4">
        {endedFocuses.map((focus) => {
          const steps = getStepsForFocus(data, focus.id).filter(
            (s) => s.status !== 'active',
          )

          return (
            <li
              key={focus.id}
              className="p-4 bg-surface border border-border rounded-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{focus.task}</p>
                  {(focus.area || focus.subArea) && (
                    <p className="text-xs text-muted mt-0.5">
                      {[focus.area, focus.subArea]
                        .filter(Boolean)
                        .join(' → ')}
                    </p>
                  )}
                </div>
                <FocusStatusBadge status={focus.status} />
              </div>

              {steps.length > 0 && (
                <ul className="mt-3 space-y-1.5 pl-3 border-l-2 border-border">
                  {steps.map((step) => (
                    <li
                      key={step.id}
                      className="flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-ink truncate">{step.task}</p>
                        <span className="text-xs text-stone-400">
                          {formatTime(step.startedAt)}
                          {step.endedAt &&
                            ` · ${formatDuration(sessionDuration(step))}`}
                        </span>
                      </div>
                      <StepStatusBadge status={step.status} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
