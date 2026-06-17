export type SessionStatus = 'active' | 'done' | 'gave_up'

export interface Session {
  id: string
  task: string
  area?: string
  subArea?: string
  startedAt: string
  endedAt?: string
  status: SessionStatus
  timerMinutes?: number
  hideTimer?: boolean
}

export interface NewSession {
  task: string
  area?: string
  subArea?: string
  timerMinutes?: number
  hideTimer?: boolean
}
