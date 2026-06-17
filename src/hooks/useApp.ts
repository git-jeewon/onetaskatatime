import { useCallback, useEffect, useState } from 'react'
import {
  getActiveStep,
  getCurrentFocus,
  loadData,
  saveData,
} from '../storage'
import type { AppData, Focus, NewFocus, Step } from '../types'

function createId(): string {
  return crypto.randomUUID()
}

export function useApp() {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const currentFocus = getCurrentFocus(data)
  const activeStep = currentFocus
    ? getActiveStep(data, currentFocus.id)
    : undefined

  const startFocus = useCallback((input: NewFocus) => {
    const focus: Focus = {
      id: createId(),
      task: input.task.trim(),
      area: input.area?.trim() || undefined,
      subArea: input.subArea?.trim() || undefined,
      startedAt: new Date().toISOString(),
      status: 'active',
      timerMinutes: input.timerMinutes,
      hideTimer: input.hideTimer,
    }
    setData((prev) => ({
      ...prev,
      focuses: [...prev.focuses, focus],
      currentFocusId: focus.id,
    }))
  }, [])

  const resumeFocus = useCallback((focusId: string) => {
    setData((prev) => ({ ...prev, currentFocusId: focusId }))
  }, [])

  const startStep = useCallback((task: string) => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev

      const step: Step = {
        id: createId(),
        focusId: focus.id,
        task: task.trim(),
        startedAt: new Date().toISOString(),
        status: 'active',
      }
      return { ...prev, steps: [...prev.steps, step] }
    })
  }, [])

  const completeStep = useCallback(() => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev
      const step = getActiveStep(prev, focus.id)
      if (!step) return prev

      return {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === step.id
            ? { ...s, status: 'done', endedAt: new Date().toISOString() }
            : s,
        ),
      }
    })
  }, [])

  const switchStep = useCallback(() => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev
      const step = getActiveStep(prev, focus.id)
      if (!step) return prev

      return {
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === step.id
            ? { ...s, status: 'switched', endedAt: new Date().toISOString() }
            : s,
        ),
      }
    })
  }, [])

  const completeFocus = useCallback(() => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev
      const now = new Date().toISOString()

      return {
        ...prev,
        focuses: prev.focuses.map((f) =>
          f.id === focus.id
            ? { ...f, status: 'done', endedAt: now }
            : f,
        ),
        steps: prev.steps.map((s) =>
          s.focusId === focus.id && s.status === 'active'
            ? { ...s, status: 'done', endedAt: now }
            : s,
        ),
        currentFocusId: null,
      }
    })
  }, [])

  const abandonFocus = useCallback(() => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev
      const now = new Date().toISOString()

      return {
        ...prev,
        focuses: prev.focuses.map((f) =>
          f.id === focus.id
            ? { ...f, status: 'switched', endedAt: now }
            : f,
        ),
        steps: prev.steps.map((s) =>
          s.focusId === focus.id && s.status === 'active'
            ? { ...s, status: 'switched', endedAt: now }
            : s,
        ),
        currentFocusId: null,
      }
    })
  }, [])

  const setHideTimer = useCallback((hideTimer: boolean) => {
    setData((prev) => {
      const focus = getCurrentFocus(prev)
      if (!focus) return prev
      return {
        ...prev,
        focuses: prev.focuses.map((f) =>
          f.id === focus.id ? { ...f, hideTimer } : f,
        ),
      }
    })
  }, [])

  const clearCurrentFocus = useCallback(() => {
    setData((prev) => ({ ...prev, currentFocusId: null }))
  }, [])

  return {
    data,
    currentFocus,
    activeStep,
    startFocus,
    resumeFocus,
    startStep,
    completeStep,
    switchStep,
    completeFocus,
    abandonFocus,
    setHideTimer,
    clearCurrentFocus,
  }
}
