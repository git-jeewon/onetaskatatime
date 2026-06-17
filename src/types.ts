export type TaskStatus = 'active' | 'done' | 'switched'

export interface Focus {
  id: string
  task: string
  area?: string
  subArea?: string
  startedAt: string
  endedAt?: string
  status: TaskStatus
  timerMinutes?: number
  hideTimer?: boolean
  accumulatedPauseMs?: number
}

export interface Step {
  id: string
  focusId: string
  task: string
  startedAt: string
  endedAt?: string
  status: TaskStatus
  accumulatedPauseMs?: number
}

export interface NewFocus {
  task: string
  area?: string
  subArea?: string
  timerMinutes?: number
  hideTimer?: boolean
}

export interface AppData {
  focuses: Focus[]
  steps: Step[]
  currentFocusId: string | null
  onBreak: boolean
  breakStartedAt: string | null
}
