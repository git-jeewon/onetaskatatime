import type { AppData, Focus, Step } from './types'

const STORAGE_KEY = 'one-task-at-a-time-data'
const LEGACY_KEY = 'one-task-at-a-time-sessions'

function emptyData(): AppData {
  return { focuses: [], steps: [], currentFocusId: null }
}

function migrateLegacy(): AppData | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const sessions = JSON.parse(raw) as Array<{
      id: string
      task: string
      area?: string
      subArea?: string
      startedAt: string
      endedAt?: string
      status: string
      timerMinutes?: number
      hideTimer?: boolean
    }>
    if (!Array.isArray(sessions)) return null

    const focuses: Focus[] = []
    const steps: Step[] = []

    for (const s of sessions) {
      const focusId = crypto.randomUUID()
      const status =
        s.status === 'done'
          ? 'done'
          : s.status === 'gave_up'
            ? 'switched'
            : 'active'

      focuses.push({
        id: focusId,
        task: s.task,
        area: s.area,
        subArea: s.subArea,
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        status,
        timerMinutes: s.timerMinutes,
        hideTimer: s.hideTimer,
      })

      if (s.status !== 'active') {
        steps.push({
          id: s.id,
          focusId,
          task: s.task,
          startedAt: s.startedAt,
          endedAt: s.endedAt,
          status,
        })
      }
    }

    const activeFocus = focuses.find((f) => f.status === 'active')
    return {
      focuses,
      steps,
      currentFocusId: activeFocus?.id ?? null,
    }
  } catch {
    return null
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (parsed?.focuses && parsed?.steps) return parsed
    }
  } catch {
    // fall through to migration
  }

  const migrated = migrateLegacy()
  if (migrated) {
    saveData(migrated)
    localStorage.removeItem(LEGACY_KEY)
    return migrated
  }

  return emptyData()
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getCurrentFocus(
  data: AppData,
): Focus | undefined {
  if (!data.currentFocusId) return undefined
  const focus = data.focuses.find((f) => f.id === data.currentFocusId)
  return focus?.status === 'active' ? focus : undefined
}

export function getActiveStep(
  data: AppData,
  focusId: string,
): Step | undefined {
  return data.steps.find(
    (s) => s.focusId === focusId && s.status === 'active',
  )
}

export function getStepsForFocus(data: AppData, focusId: string): Step[] {
  return data.steps
    .filter((s) => s.focusId === focusId)
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
}

export function getTodayActiveFocuses(data: AppData): Focus[] {
  const today = new Date().toDateString()
  return data.focuses
    .filter(
      (f) =>
        f.status === 'active' && new Date(f.startedAt).toDateString() === today,
    )
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
}

export function getTodayCompletedFocuses(data: AppData): Focus[] {
  const today = new Date().toDateString()
  return data.focuses
    .filter(
      (f) =>
        f.status !== 'active' &&
        new Date(f.startedAt).toDateString() === today,
    )
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
}

export function getUniqueAreas(focuses: Focus[]): string[] {
  const areas = new Set<string>()
  for (const f of focuses) {
    if (f.area?.trim()) areas.add(f.area.trim())
  }
  return [...areas].sort()
}

export function getUniqueSubAreas(
  focuses: Focus[],
  area?: string,
): string[] {
  const subAreas = new Set<string>()
  for (const f of focuses) {
    if (area && f.area?.trim() !== area.trim()) continue
    if (f.subArea?.trim()) subAreas.add(f.subArea.trim())
  }
  return [...subAreas].sort()
}
