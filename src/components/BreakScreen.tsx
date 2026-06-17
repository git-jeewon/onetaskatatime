import { useEffect, useState } from 'react'
import type { Focus, Step } from '../types'
import { formatDuration } from '../utils/time'

interface BreakScreenProps {
  breakStartedAt: string
  focus?: Focus
  step?: Step
  onResume: () => void
}

export function BreakScreen({
  breakStartedAt,
  focus,
  step,
  onResume,
}: BreakScreenProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const breakMs = now - new Date(breakStartedAt).getTime()

  return (
    <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center justify-center flex-1 py-12">
      <p className="text-sm text-muted mb-3">You&apos;re on a break</p>

      <h1 className="text-3xl sm:text-4xl font-medium text-ink mb-2">
        Take it easy
      </h1>

      <p className="text-5xl font-light tabular-nums tracking-tight text-muted mb-10">
        {formatDuration(breakMs)}
      </p>

      {(focus || step) && (
        <div className="mb-10 px-4 py-3 bg-surface border border-border rounded-xl text-left w-full">
          <p className="text-xs text-muted mb-1">Paused</p>
          {focus && (
            <p className="text-sm text-ink">{focus.task}</p>
          )}
          {step && (
            <p className="text-xs text-muted mt-1">{step.task}</p>
          )}
        </div>
      )}

      <p className="text-lg text-ink mb-6">Ready to start again?</p>

      <button
        type="button"
        onClick={onResume}
        className="w-full max-w-xs py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors"
      >
        Resume
      </button>
    </div>
  )
}
