import { useState } from 'react'
import { ActiveStep } from './components/ActiveStep'
import { BreakScreen } from './components/BreakScreen'
import { FocusPrompt } from './components/FocusPrompt'
import { SmallStepPrompt } from './components/SmallStepPrompt'
import { SwitchTaskPanel } from './components/SwitchTaskPanel'
import { TodayHistory } from './components/TodayHistory'
import { useApp } from './hooks/useApp'
import {
  getTodayActiveFocuses,
  getUniqueAreas,
  getUniqueSubAreas,
} from './storage'

function App() {
  const {
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
    startBreak,
    endBreak,
  } = useApp()

  const [showSwitchPanel, setShowSwitchPanel] = useState(false)

  const areas = getUniqueAreas(data.focuses)
  const subAreas = getUniqueSubAreas(data.focuses)
  const todayActiveFocuses = getTodayActiveFocuses(data)
  const canTakeBreak = !!currentFocus && !data.onBreak

  function handleSwitchTask() {
    switchStep()
    setShowSwitchPanel(true)
  }

  function handleResumeFocus(focusId: string) {
    resumeFocus(focusId)
    setShowSwitchPanel(false)
  }

  function handleNewTask() {
    clearCurrentFocus()
    setShowSwitchPanel(false)
  }

  function handleAbandonFocus() {
    abandonFocus()
    setShowSwitchPanel(false)
  }

  const showHistory =
    !currentFocus && !showSwitchPanel && !data.onBreak

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between">
        <p className="text-sm font-medium text-muted tracking-wide">
          One Task at a Time
        </p>
        {canTakeBreak && (
          <button
            type="button"
            onClick={startBreak}
            className="text-sm text-muted hover:text-ink transition-colors"
          >
            Take a break
          </button>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        {data.onBreak && data.breakStartedAt ? (
          <BreakScreen
            breakStartedAt={data.breakStartedAt}
            focus={currentFocus}
            step={activeStep}
            onResume={endBreak}
          />
        ) : !currentFocus ? (
          <FocusPrompt
            areas={areas}
            subAreas={subAreas}
            todayFocuses={todayActiveFocuses}
            onStart={startFocus}
            onResume={resumeFocus}
          />
        ) : activeStep ? (
          <ActiveStep
            focus={currentFocus}
            step={activeStep}
            onDone={completeStep}
            onSwitchTask={handleSwitchTask}
            onCompleteFocus={completeFocus}
            onToggleHideTimer={() =>
              setHideTimer(!currentFocus.hideTimer)
            }
          />
        ) : (
          <SmallStepPrompt
            focus={currentFocus}
            onStart={startStep}
            onCompleteFocus={completeFocus}
            onAbandonFocus={handleAbandonFocus}
            onSwitchTask={() => setShowSwitchPanel(true)}
            onToggleHideTimer={() =>
              setHideTimer(!currentFocus.hideTimer)
            }
          />
        )}

        {showHistory && <TodayHistory data={data} />}
      </main>

      {showSwitchPanel && !data.onBreak && (
        <SwitchTaskPanel
          currentFocusId={currentFocus?.id ?? ''}
          todayFocuses={todayActiveFocuses}
          onResume={handleResumeFocus}
          onNewTask={handleNewTask}
          onCancel={() => setShowSwitchPanel(false)}
        />
      )}
    </div>
  )
}

export default App
