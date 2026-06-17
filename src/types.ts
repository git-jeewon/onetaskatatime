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
}

export interface Step {
  id: string
  focusId: string
  task: string
  startedAt: string
  endedAt?: string
  status: TaskStatus
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
}
