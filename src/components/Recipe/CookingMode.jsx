import { useState, useEffect, useRef, useCallback } from 'react'
import { extractIngredients } from '../../api/mealdb'

// Parse timers from step text
const parseTimerFromStep = (step) => {
  const timeRegex = /(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|second|seconds|sec|secs)/gi
  const matches = []
  let match

  while ((match = timeRegex.exec(step)) !== null) {
    const value = parseInt(match[1], 10)
    const unit = match[2].toLowerCase()
    let seconds
    if (unit.startsWith('hour') || unit.startsWith('hr')) {
      seconds = value * 3600
    } else if (unit.startsWith('min')) {
      seconds = value * 60
    } else {
      seconds = value
    }
    matches.push({ value, unit: match[2], seconds, label: match[0] })
  }

  return matches
}

// Format seconds to mm:ss or hh:mm:ss
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function CookingMode({ meal, steps, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showIngredients, setShowIngredients] = useState(false)
  const [timers, setTimers] = useState([]) // { id, seconds, remaining, isRunning, label }
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('idle') // idle, listening, processing
  const [lastCommand, setLastCommand] = useState('')
  const [wakeLock, setWakeLock] = useState(null)
  const timerIntervalsRef = useRef({})
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  const ingredients = extractIngredients(meal)
  const totalSteps = steps.length
  const stepTimers = parseTimerFromStep(steps[currentStep] || '')

  // Request wake lock to keep screen on
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen')
          setWakeLock(lock)
          lock.addEventListener('release', () => {
            setWakeLock(null)
          })
        }
      } catch (err) {
        console.log('Wake Lock not supported or denied:', err)
      }
    }

    requestWakeLock()

    // Re-request on visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !wakeLock) {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [])

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Voice recognition setup
  useEffect(() => {
    if (!voiceEnabled) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported')
      setVoiceEnabled(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setVoiceStatus('listening')
    }

    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const command = event.results[last][0].transcript.toLowerCase().trim()
      setLastCommand(command)
      setVoiceStatus('processing')
      handleVoiceCommand(command)
      setTimeout(() => setVoiceStatus('listening'), 500)
    }

    recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setVoiceStatus('listening')
      }
    }

    recognition.onend = () => {
      // Restart if still enabled
      if (voiceEnabled) {
        try {
          recognition.start()
        } catch (e) {
          // Already started
        }
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.log('Could not start recognition:', e)
    }

    return () => {
      recognition.stop()
    }
  }, [voiceEnabled])

  // Handle voice commands
  const handleVoiceCommand = useCallback((command) => {
    const cmd = command.toLowerCase()

    if (cmd.includes('next') || cmd.includes('forward') || cmd.includes('continue')) {
      goToNextStep()
      speak('Next step')
    } else if (cmd.includes('back') || cmd.includes('previous') || cmd.includes('go back')) {
      goToPrevStep()
      speak('Previous step')
    } else if (cmd.includes('repeat') || cmd.includes('again') || cmd.includes('read')) {
      readCurrentStep()
    } else if (cmd.includes('ingredient')) {
      setShowIngredients(true)
      speak('Showing ingredients')
    } else if (cmd.includes('close ingredient') || cmd.includes('hide ingredient')) {
      setShowIngredients(false)
      speak('Hiding ingredients')
    } else if (cmd.includes('timer') || cmd.includes('start')) {
      // Try to extract time from command: "start timer 5 minutes"
      const timeMatch = cmd.match(/(\d+)\s*(minute|minutes|min|second|seconds|sec|hour|hours)/i)
      if (timeMatch) {
        const value = parseInt(timeMatch[1], 10)
        const unit = timeMatch[2].toLowerCase()
        let seconds
        if (unit.startsWith('hour')) {
          seconds = value * 3600
        } else if (unit.startsWith('min')) {
          seconds = value * 60
        } else {
          seconds = value
        }
        addTimer(seconds, `${value} ${timeMatch[2]}`)
        speak(`Timer set for ${value} ${timeMatch[2]}`)
      } else if (stepTimers.length > 0) {
        // Start first timer from current step
        addTimer(stepTimers[0].seconds, stepTimers[0].label)
        speak(`Timer set for ${stepTimers[0].label}`)
      }
    } else if (cmd.includes('stop timer') || cmd.includes('cancel timer')) {
      stopAllTimers()
      speak('Timers stopped')
    } else if (cmd.includes('exit') || cmd.includes('close') || cmd.includes('done')) {
      speak('Exiting cooking mode')
      setTimeout(onClose, 500)
    }
  }, [currentStep, stepTimers])

  // Text to speech
  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      synthRef.current.speak(utterance)
    }
  }

  const readCurrentStep = () => {
    if (steps[currentStep]) {
      speak(`Step ${currentStep + 1}. ${steps[currentStep]}`)
    }
  }

  // Navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Timer management
  const addTimer = (seconds, label) => {
    const id = Date.now().toString()
    setTimers(prev => [...prev, { id, seconds, remaining: seconds, isRunning: true, label }])
  }

  const toggleTimer = (id) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, isRunning: !t.isRunning } : t
    ))
  }

  const removeTimer = (id) => {
    setTimers(prev => prev.filter(t => t.id !== id))
    if (timerIntervalsRef.current[id]) {
      clearInterval(timerIntervalsRef.current[id])
      delete timerIntervalsRef.current[id]
    }
  }

  const stopAllTimers = () => {
    Object.keys(timerIntervalsRef.current).forEach(id => {
      clearInterval(timerIntervalsRef.current[id])
    })
    timerIntervalsRef.current = {}
    setTimers([])
  }

  // Timer tick effect
  useEffect(() => {
    timers.forEach(timer => {
      if (timer.isRunning && !timerIntervalsRef.current[timer.id]) {
        timerIntervalsRef.current[timer.id] = setInterval(() => {
          setTimers(prev => prev.map(t => {
            if (t.id === timer.id) {
              const newRemaining = t.remaining - 1
              if (newRemaining <= 0) {
                // Timer finished
                clearInterval(timerIntervalsRef.current[timer.id])
                delete timerIntervalsRef.current[timer.id]
                speak('Timer finished!')
                // Play sound
                try {
                  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dmJWTjoiBenh5e4CDhomLjY+OjIqIhYKAgH+AgYOFiIqMjY6OjYyKiIaEgoGAgIGDhYeJi4yNjY2MioiGhIKBgICAgoSGiIqMjY6OjYyKiIaDgYCAgIGDhYeJi4yNjo6NjIqIhoSCgYCAgoOFh4mLjI2Ojo2MioiGhIKBgA==')
                  audio.play().catch(() => {})
                } catch {}
                return { ...t, remaining: 0, isRunning: false }
              }
              return { ...t, remaining: newRemaining }
            }
            return t
          }))
        }, 1000)
      } else if (!timer.isRunning && timerIntervalsRef.current[timer.id]) {
        clearInterval(timerIntervalsRef.current[timer.id])
        delete timerIntervalsRef.current[timer.id]
      }
    })

    return () => {
      Object.keys(timerIntervalsRef.current).forEach(id => {
        clearInterval(timerIntervalsRef.current[id])
      })
    }
  }, [timers])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      Object.keys(timerIntervalsRef.current).forEach(id => {
        clearInterval(timerIntervalsRef.current[id])
      })
      if (wakeLock) {
        wakeLock.release()
      }
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevStep()
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'i') {
        setShowIngredients(!showIngredients)
      } else if (e.key === 'r') {
        readCurrentStep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, showIngredients])

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-none">
              {meal.strMeal}
            </h1>
            <p className="text-sm text-gray-400">Cooking Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wake Lock Indicator */}
          {wakeLock && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Screen On
            </span>
          )}

          {/* Voice Control Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              voiceEnabled
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="hidden sm:inline text-sm">Voice {voiceEnabled ? 'On' : 'Off'}</span>
          </button>

          {/* Ingredients Toggle */}
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className={`p-2 rounded-lg transition-colors ${
              showIngredients
                ? 'bg-primary-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </header>

      {/* Voice Status Bar */}
      {voiceEnabled && (
        <div className="flex-shrink-0 px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              voiceStatus === 'listening' ? 'bg-emerald-500 animate-pulse' :
              voiceStatus === 'processing' ? 'bg-amber-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm text-gray-400">
              {voiceStatus === 'listening' ? 'Listening...' :
               voiceStatus === 'processing' ? 'Processing...' : 'Voice ready'}
            </span>
          </div>
          {lastCommand && (
            <span className="text-sm text-gray-500">
              Heard: "{lastCommand}"
            </span>
          )}
          <div className="hidden sm:block text-xs text-gray-500">
            Say: "Next", "Back", "Repeat", "Timer 5 minutes"
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step Content */}
        <main className={`flex-1 flex flex-col ${showIngredients ? 'lg:mr-80' : ''}`}>
          {/* Progress Bar */}
          <div className="flex-shrink-0 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {currentStep + 1} of {totalSteps}</span>
              <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Text */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-auto">
            <div className="max-w-3xl text-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white text-2xl font-bold mb-6">
                {currentStep + 1}
              </span>
              <p className="text-2xl sm:text-3xl lg:text-4xl text-white leading-relaxed font-light">
                {steps[currentStep]}
              </p>

              {/* Step Timers */}
              {stepTimers.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {stepTimers.map((timer, i) => (
                    <button
                      key={i}
                      onClick={() => addTimer(timer.seconds, timer.label)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-400 hover:bg-primary-600/30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start {timer.label} timer
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-shrink-0 p-4 flex items-center justify-between gap-4">
            <button
              onClick={goToPrevStep}
              disabled={currentStep === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={readCurrentStep}
              className="p-4 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-colors"
              title="Read step aloud"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={goToNextStep}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-colors"
              >
                <span className="hidden sm:inline">Next Step</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Done!</span>
              </button>
            )}
          </div>
        </main>

        {/* Ingredients Sidebar */}
        {showIngredients && (
          <aside className="hidden lg:block fixed right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto pt-20">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h2>
              <ul className="space-y-2">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-primary-400 mt-1">•</span>
                    <span>
                      <span className="font-medium text-white">{item.measure}</span>{' '}
                      {item.ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Mobile Ingredients Panel */}
        {showIngredients && (
          <div className="lg:hidden fixed inset-0 bg-black/80 z-10" onClick={() => setShowIngredients(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-gray-800 rounded-t-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Ingredients</h2>
                <button
                  onClick={() => setShowIngredients(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(60vh-60px)]">
                <ul className="space-y-2">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-primary-400 mt-1">•</span>
                      <span>
                        <span className="font-medium text-white">{item.measure}</span>{' '}
                        {item.ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Timers Bar */}
      {timers.length > 0 && (
        <div className="flex-shrink-0 p-3 bg-gray-800 border-t border-gray-700 flex items-center gap-3 overflow-x-auto">
          <span className="text-sm text-gray-400 flex-shrink-0">Timers:</span>
          {timers.map(timer => (
            <div
              key={timer.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-shrink-0 ${
                timer.remaining === 0
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : timer.isRunning
                  ? 'bg-primary-600/30 border border-primary-500/50 text-primary-300'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <span className="font-mono font-bold">{formatTime(timer.remaining)}</span>
              <span className="text-xs opacity-70">{timer.label}</span>
              <button
                onClick={() => toggleTimer(timer.id)}
                className="p-1 hover:bg-white/10 rounded"
              >
                {timer.isRunning ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => removeTimer(timer.id)}
                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="hidden sm:block absolute bottom-20 left-4 text-xs text-gray-500">
        <span className="bg-gray-700 px-2 py-1 rounded mr-2">←→</span> Navigate
        <span className="bg-gray-700 px-2 py-1 rounded mx-2">R</span> Read aloud
        <span className="bg-gray-700 px-2 py-1 rounded mx-2">I</span> Ingredients
        <span className="bg-gray-700 px-2 py-1 rounded mx-2">ESC</span> Exit
      </div>
    </div>
  )
}
