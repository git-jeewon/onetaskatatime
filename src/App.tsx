import { ActiveSession } from './components/ActiveSession'
import { SessionHistory } from './components/SessionHistory'
import { TaskPrompt } from './components/TaskPrompt'
import { useSessions } from './hooks/useSessions'
import {
  getTodaySessions,
  getUniqueAreas,
  getUniqueSubAreas,
} from './storage'

function App() {
  const { sessions, activeSession, startSession, endSession, setHideTimer } =
    useSessions()

  const areas = getUniqueAreas(sessions)
  const subAreas = getUniqueSubAreas(sessions)
  const todaySessions = getTodaySessions(sessions)

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-6 py-5">
        <p className="text-sm font-medium text-muted tracking-wide">
          One Task at a Time
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        {activeSession ? (
          <ActiveSession
            session={activeSession}
            onDone={() => endSession(activeSession.id, 'done')}
            onGiveUp={() => endSession(activeSession.id, 'gave_up')}
            onToggleHideTimer={() =>
              setHideTimer(activeSession.id, !activeSession.hideTimer)
            }
          />
        ) : (
          <TaskPrompt
            areas={areas}
            subAreas={subAreas}
            onStart={startSession}
          />
        )}

        {!activeSession && (
          <SessionHistory sessions={todaySessions} />
        )}
      </main>
    </div>
  )
}

export default App
