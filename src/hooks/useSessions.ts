import { useCallback, useEffect, useState } from 'react'
import {
  getActiveSession,
  loadSessions,
  saveSessions,
} from '../storage'
import type { NewSession, Session } from '../types'

function createId(): string {
  return crypto.randomUUID()
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())

  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  const activeSession = getActiveSession(sessions)

  const startSession = useCallback((input: NewSession) => {
    const session: Session = {
      id: createId(),
      task: input.task.trim(),
      area: input.area?.trim() || undefined,
      subArea: input.subArea?.trim() || undefined,
      startedAt: new Date().toISOString(),
      status: 'active',
      timerMinutes: input.timerMinutes,
      hideTimer: input.hideTimer,
    }
    setSessions((prev) => [...prev, session])
  }, [])

  const setHideTimer = useCallback((id: string, hideTimer: boolean) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hideTimer } : s)),
    )
  }, [])

  const endSession = useCallback((id: string, status: 'done' | 'gave_up') => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, endedAt: new Date().toISOString() }
          : s,
      ),
    )
  }, [])

  return { sessions, activeSession, startSession, endSession, setHideTimer }
}
