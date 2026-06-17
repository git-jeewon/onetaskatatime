import type { Focus } from '../types'

interface FocusHeaderProps {
  focus: Focus
  compact?: boolean
}

export function FocusHeader({ focus, compact }: FocusHeaderProps) {
  return (
    <div className={compact ? 'mb-6' : 'mb-8'}>
      <p className="text-sm text-muted mb-1">Task</p>
      <p
        className={`font-medium text-ink leading-snug ${
          compact ? 'text-lg' : 'text-xl sm:text-2xl'
        }`}
      >
        {focus.task}
      </p>
      {(focus.area || focus.subArea) && (
        <p className="text-sm text-muted mt-1">
          {[focus.area, focus.subArea].filter(Boolean).join(' → ')}
        </p>
      )}
    </div>
  )
}
