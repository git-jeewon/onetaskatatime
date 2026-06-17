import { useEffect, useState } from 'react'
import type { Focus } from '../types'
import { formatDuration, getActiveElapsedMs } from '../utils/time'

interface FocusTimerProps {
  focus: Focus
  breakStartedAt?: string | null
}

export function FocusTimer({ focus, breakStartedAt = null }: FocusTimerProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = getActiveElapsedMs(
    focus.startedAt,
    focus.accumulatedPauseMs,
    breakStartedAt,
    now,
  )

  if (focus.timerMinutes) {
    const total = focus.timerMinutes * 60 * 1000
    const remaining = Math.max(0, total - elapsed)
    const isExpired = remaining === 0

    return (
      <div className="text-center">
        <p className="text-sm text-muted mb-1">
          {isExpired ? 'Time is up' : 'Time remaining'}
        </p>
        <p
          className={`text-5xl font-light tabular-nums tracking-tight ${
            isExpired ? 'text-gave-up' : 'text-ink'
          }`}
        >
          {formatDuration(remaining)}
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted mb-1">Elapsed</p>
      <p className="text-5xl font-light tabular-nums tracking-tight text-ink">
        {formatDuration(elapsed)}
      </p>
    </div>
  )
}
