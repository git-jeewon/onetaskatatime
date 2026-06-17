import { useState, type FormEvent } from 'react'
import { TIMER_PRESETS } from '../constants'
import type { Focus, NewFocus } from '../types'

interface FocusPromptProps {
  areas: string[]
  subAreas: string[]
  todayFocuses: Focus[]
  onStart: (focus: NewFocus) => void
  onResume: (focusId: string) => void
}

export function FocusPrompt({
  areas,
  subAreas,
  todayFocuses,
  onStart,
  onResume,
}: FocusPromptProps) {
  const [task, setTask] = useState('')
  const [area, setArea] = useState('')
  const [subArea, setSubArea] = useState('')
  const [timerMinutes, setTimerMinutes] = useState<number | undefined>()
  const [hideTimer, setHideTimer] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!task.trim()) return
    onStart({
      task,
      area: area || undefined,
      subArea: subArea || undefined,
      timerMinutes,
      hideTimer,
    })
    setTask('')
    setArea('')
    setSubArea('')
    setTimerMinutes(undefined)
    setHideTimer(false)
    setShowOptions(false)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl sm:text-3xl font-medium text-center text-ink mb-8 leading-snug">
          What do you want to work on?
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. Finish blog post draft"
            autoFocus
            className="w-full px-4 py-3.5 text-lg bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-shadow"
          />

          {!showOptions ? (
            <button
              type="button"
              onClick={() => setShowOptions(true)}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              + Add area, timer, or other options
            </button>
          ) : (
            <div className="space-y-3 p-4 bg-surface border border-border rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="area" className="block text-xs text-muted mb-1">
                    Area <span className="text-stone-400">(optional)</span>
                  </label>
                  <input
                    id="area"
                    type="text"
                    list="areas-list"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Work, Health…"
                    className="w-full px-3 py-2 text-sm bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <datalist id="areas-list">
                    {areas.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label
                    htmlFor="subArea"
                    className="block text-xs text-muted mb-1"
                  >
                    Sub-area <span className="text-stone-400">(optional)</span>
                  </label>
                  <input
                    id="subArea"
                    type="text"
                    list="subareas-list"
                    value={subArea}
                    onChange={(e) => setSubArea(e.target.value)}
                    placeholder="Writing, Exercise…"
                    className="w-full px-3 py-2 text-sm bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                  />
                  <datalist id="subareas-list">
                    {subAreas.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <span className="block text-xs text-muted mb-2">
                  Timer <span className="text-stone-400">(optional)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {TIMER_PRESETS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() =>
                        setTimerMinutes(
                          timerMinutes === mins ? undefined : mins,
                        )
                      }
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        timerMinutes === mins
                          ? 'bg-accent text-white border-accent'
                          : 'bg-cream border-border text-ink hover:border-accent/50'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideTimer}
                  onChange={(e) => setHideTimer(e.target.checked)}
                  className="rounded border-border text-accent focus:ring-accent/30"
                />
                <span className="text-sm text-ink">Hide timer</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={!task.trim()}
            className="w-full py-3.5 text-base font-medium text-white bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Start
          </button>
        </div>
      </form>

      {todayFocuses.length > 0 && (
        <section className="mt-10 pt-8 border-t border-border">
          <h3 className="text-sm font-medium text-muted mb-3">
            Today&apos;s tasks
          </h3>
          <ul className="space-y-2">
            {todayFocuses.map((focus) => (
              <li key={focus.id}>
                <button
                  type="button"
                  onClick={() => onResume(focus.id)}
                  className="w-full text-left p-3 bg-surface border border-border rounded-xl hover:border-accent/50 transition-colors"
                >
                  <p className="text-sm text-ink">{focus.task}</p>
                  {(focus.area || focus.subArea) && (
                    <p className="text-xs text-muted mt-0.5">
                      {[focus.area, focus.subArea]
                        .filter(Boolean)
                        .join(' → ')}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
