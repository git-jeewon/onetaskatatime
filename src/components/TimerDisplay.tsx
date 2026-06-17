import { useEffect, useState } from 'react'
import type { Session } from '../types'
import { formatDuration } from '../utils/time'

interface TimerDisplayProps {
  session: Session
}

export function TimerDisplay({ session }: TimerDisplayProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = now - new Date(session.startedAt).getTime()

  if (session.timerMinutes) {
    const total = session.timerMinutes * 60 * 1000
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
