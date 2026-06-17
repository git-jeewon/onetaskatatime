import type { Session } from '../types'
import { formatDuration, formatTime, sessionDuration } from '../utils/time'

interface SessionHistoryProps {
  sessions: Session[]
}

function StatusBadge({ status }: { status: Session['status'] }) {
  if (status === 'done') {
    return (
      <span className="text-xs font-medium text-done bg-green-50 px-2 py-0.5 rounded-full">
        Done
      </span>
    )
  }
  return (
    <span className="text-xs font-medium text-gave-up bg-amber-50 px-2 py-0.5 rounded-full">
      Gave up
    </span>
  )
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  if (sessions.length === 0) return null

  const doneCount = sessions.filter((s) => s.status === 'done').length

  return (
    <section className="w-full max-w-lg mx-auto mt-16 pt-8 border-t border-border">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-medium text-muted">Today</h3>
        <p className="text-xs text-muted">
          {doneCount} of {sessions.length} completed
        </p>
      </div>

      <ul className="space-y-2">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex items-start gap-3 p-3 bg-surface border border-border rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink truncate">{session.task}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {(session.area || session.subArea) && (
                  <span className="text-xs text-muted">
                    {[session.area, session.subArea].filter(Boolean).join(' → ')}
                  </span>
                )}
                <span className="text-xs text-stone-400">
                  {formatTime(session.startedAt)}
                  {' · '}
                  {formatDuration(sessionDuration(session))}
                </span>
              </div>
            </div>
            <StatusBadge status={session.status} />
          </li>
        ))}
      </ul>
    </section>
  )
}
