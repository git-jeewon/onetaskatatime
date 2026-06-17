import type { Session } from './types'

const STORAGE_KEY = 'one-task-at-a-time-sessions'

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Session[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function getActiveSession(sessions: Session[]): Session | undefined {
  return sessions.find((s) => s.status === 'active')
}

export function getUniqueAreas(sessions: Session[]): string[] {
  const areas = new Set<string>()
  for (const s of sessions) {
    if (s.area?.trim()) areas.add(s.area.trim())
  }
  return [...areas].sort()
}

export function getUniqueSubAreas(sessions: Session[], area?: string): string[] {
  const subAreas = new Set<string>()
  for (const s of sessions) {
    if (area && s.area?.trim() !== area.trim()) continue
    if (s.subArea?.trim()) subAreas.add(s.subArea.trim())
  }
  return [...subAreas].sort()
}

export function getTodaySessions(sessions: Session[]): Session[] {
  const today = new Date().toDateString()
  return sessions
    .filter((s) => s.status !== 'active' && new Date(s.startedAt).toDateString() === today)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
}
