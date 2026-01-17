import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp, getDateKey, getWeekStart, getWeekDates, addDays, MEAL_SLOTS, createEmptyDay } from '../../context/AppContext'

const SLOT_CONFIG = {
  breakfast: { label: 'Breakfast', icon: '🌅', shortLabel: 'B' },
  lunch: { label: 'Lunch', icon: '☀️', shortLabel: 'L' },
  dinner: { label: 'Dinner', icon: '🌙', shortLabel: 'D' },
  snacks: { label: 'Snacks', icon: '🍿', shortLabel: 'S' },
  dessert: { label: 'Dessert', icon: '🍰', shortLabel: 'De' },
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarView() {
  const { calendarMeals, removeFromCalendar, clearCalendarDay, copyWeek, repeatWeek, showToast } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showRepeatModal, setShowRepeatModal] = useState(false)
  const [repeatWeeks, setRepeatWeeks] = useState(4)

  // Get calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of month
    const firstDay = new Date(year, month, 1)
    // Last day of month
    const lastDay = new Date(year, month + 1, 0)

    // Get the Monday of the week containing the first day
    const startDay = new Date(firstDay)
    const dayOfWeek = startDay.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDay.setDate(startDay.getDate() + diff)

    // Generate 6 weeks of dates (42 days)
    const days = []
    const current = new Date(startDay)
    for (let i = 0; i < 42; i++) {
      const dateKey = getDateKey(current)
      days.push({
        date: new Date(current),
        dateKey,
        isCurrentMonth: current.getMonth() === month,
        isToday: getDateKey(new Date()) === dateKey,
        meals: calendarMeals[dateKey] || null,
      })
      current.setDate(current.getDate() + 1)
    }

    return days
  }, [currentDate, calendarMeals])

  // Get weeks for the calendar
  const weeks = useMemo(() => {
    const result = []
    for (let i = 0; i < calendarData.length; i += 7) {
      result.push(calendarData.slice(i, i + 7))
    }
    return result
  }, [calendarData])

  // Count meals for a day
  const getMealCount = (dayMeals) => {
    if (!dayMeals) return 0
    return MEAL_SLOTS.reduce((count, slot) => {
      if (slot === 'snacks') {
        return count + (dayMeals.snacks?.length || 0)
      }
      return count + (dayMeals[slot] ? 1 : 0)
    }, 0)
  }

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get current week start for copy/repeat operations
  const currentWeekStart = useMemo(() => {
    return getWeekStart(new Date())
  }, [])

  // Handle copy previous week
  const handleCopyPreviousWeek = () => {
    const previousWeekStart = addDays(currentWeekStart, -7)
    const previousWeekDates = getWeekDates(previousWeekStart)

    // Check if previous week has any meals
    const hasMeals = previousWeekDates.some(dateKey => calendarMeals[dateKey])
    if (!hasMeals) {
      showToast('No meals to copy from previous week', 'error')
      return
    }

    copyWeek(getDateKey(previousWeekStart), getDateKey(currentWeekStart))
    setShowCopyModal(false)
  }

  // Handle repeat week
  const handleRepeatWeek = () => {
    const currentWeekDates = getWeekDates(currentWeekStart)
    const hasMeals = currentWeekDates.some(dateKey => calendarMeals[dateKey])

    if (!hasMeals) {
      showToast('No meals to repeat in current week', 'error')
      return
    }

    repeatWeek(getDateKey(currentWeekStart), repeatWeeks)
    setShowRepeatModal(false)
  }

  // Render meal indicators for a day
  const renderMealIndicators = (dayMeals) => {
    if (!dayMeals) return null

    const indicators = []
    MEAL_SLOTS.forEach(slot => {
      const hasMeal = slot === 'snacks'
        ? dayMeals.snacks?.length > 0
        : dayMeals[slot]

      if (hasMeal) {
        indicators.push(
          <span key={slot} className="text-[10px]" title={SLOT_CONFIG[slot].label}>
            {SLOT_CONFIG[slot].icon}
          </span>
        )
      }
    })

    return indicators.length > 0 ? (
      <div className="flex flex-wrap gap-0.5 justify-center mt-1">
        {indicators}
      </div>
    ) : null
  }

  // Selected day modal content
  const selectedDayMeals = selectedDate ? calendarMeals[selectedDate] : null
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[180px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCopyModal(true)}
            className="btn btn-secondary text-sm"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Previous Week
          </button>
          <button
            onClick={() => setShowRepeatModal(true)}
            className="btn btn-secondary text-sm"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Repeat Weekly
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          {WEEKDAY_LABELS.map(day => (
            <div key={day} className="py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-700">
              {week.map(day => {
                const mealCount = getMealCount(day.meals)
                return (
                  <button
                    key={day.dateKey}
                    onClick={() => setSelectedDate(day.dateKey)}
                    className={`min-h-[80px] p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !day.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/30' : ''
                    } ${day.isToday ? 'ring-2 ring-inset ring-primary-500' : ''}`}
                  >
                    <div className={`text-sm font-medium ${
                      day.isToday
                        ? 'text-primary-600 dark:text-primary-400'
                        : day.isCurrentMonth
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    {mealCount > 0 && (
                      <div className="mt-1">
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded">
                          {mealCount} meal{mealCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                    {renderMealIndicators(day.meals)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDate(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDateObj?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getMealCount(selectedDayMeals)} meal{getMealCount(selectedDayMeals) !== 1 ? 's' : ''} planned
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
              {MEAL_SLOTS.map(slot => {
                const meals = slot === 'snacks'
                  ? (selectedDayMeals?.snacks || [])
                  : (selectedDayMeals?.[slot] ? [selectedDayMeals[slot]] : [])

                return (
                  <div key={slot}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{SLOT_CONFIG[slot].icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{SLOT_CONFIG[slot].label}</span>
                    </div>

                    {meals.length > 0 ? (
                      <div className="space-y-2">
                        {meals.map((meal, idx) => (
                          <div key={meal.idMeal} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <Link to={`/recipe/${meal.idMeal}`} className="flex items-center gap-3 flex-1 min-w-0">
                              <img
                                src={meal.strMealThumb}
                                alt={meal.strMeal}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {meal.strMeal}
                              </span>
                            </Link>
                            <button
                              onClick={() => removeFromCalendar(selectedDate, slot, meal.idMeal)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                        No {slot} planned
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {getMealCount(selectedDayMeals) > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    clearCalendarDay(selectedDate)
                    setSelectedDate(null)
                  }}
                  className="w-full btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Clear All Meals
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Copy Previous Week Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCopyModal(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Copy Previous Week</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This will copy all meals from last week to the current week. Any existing meals in the current week will be kept.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopyPreviousWeek}
                  className="flex-1 btn btn-primary"
                >
                  Copy Week
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repeat Weekly Modal */}
      {showRepeatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRepeatModal(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Repeat Weekly Plan</h3>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Repeat this week's meal plan for the following weeks.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of weeks to repeat
                </label>
                <select
                  value={repeatWeeks}
                  onChange={e => setRepeatWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} week{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowRepeatModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepeatWeek}
                  className="flex-1 btn btn-primary"
                >
                  Repeat Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
