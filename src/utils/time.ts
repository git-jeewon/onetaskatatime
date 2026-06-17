export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getActiveElapsedMs(
  startedAt: string,
  accumulatedPauseMs = 0,
  breakStartedAt: string | null = null,
  now = Date.now(),
): number {
  const start = new Date(startedAt).getTime()
  const currentBreakMs = breakStartedAt
    ? now - new Date(breakStartedAt).getTime()
    : 0
  return Math.max(0, now - start - accumulatedPauseMs - currentBreakMs)
}

export function sessionDuration(session: {
  startedAt: string
  endedAt?: string
  accumulatedPauseMs?: number
}): number {
  const end = session.endedAt ? new Date(session.endedAt).getTime() : Date.now()
  return (
    end -
    new Date(session.startedAt).getTime() -
    (session.accumulatedPauseMs ?? 0)
  )
}
