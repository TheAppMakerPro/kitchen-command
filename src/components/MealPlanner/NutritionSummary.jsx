import { useState, useMemo, useEffect } from 'react'
import { useApp, DAYS, MEAL_SLOTS, getWeekDates, getWeekStart, getDateKey } from '../../context/AppContext'
import { getMealById, extractIngredients } from '../../api/mealdb'
import {
  calculateRecipeNutrition,
  DEFAULT_DAILY_TARGETS,
  getBalanceStatus,
  calculateMacroPercentages,
  MACRO_RANGES,
} from '../../data/nutritionData'

const MACRO_COLORS = {
  protein: { bg: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400' },
  carbs: { bg: 'bg-amber-500', light: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400' },
  fat: { bg: 'bg-rose-500', light: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400' },
  fiber: { bg: 'bg-green-500', light: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400' },
  calories: { bg: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400' },
}

export default function NutritionSummary({ view = 'week' }) {
  const { mealPlan, calendarMeals } = useApp()
  const [nutritionData, setNutritionData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)
  const [targets, setTargets] = useState(DEFAULT_DAILY_TARGETS)
  const [showTargetsModal, setShowTargetsModal] = useState(false)

  // Get week dates for calendar view
  const weekDates = useMemo(() => {
    return getWeekDates(getWeekStart(new Date()))
  }, [])

  // Get all meals from week view meal plan
  const getWeekMeals = useMemo(() => {
    const meals = {}
    DAYS.forEach(day => {
      meals[day] = []
      const dayData = mealPlan[day]
      if (!dayData) return

      MEAL_SLOTS.forEach(slot => {
        if (slot === 'snacks') {
          (dayData.snacks || []).forEach(meal => {
            if (meal) meals[day].push(meal)
          })
        } else if (dayData[slot]) {
          meals[day].push(dayData[slot])
        }
      })
    })
    return meals
  }, [mealPlan])

  // Get all meals from calendar view
  const getCalendarMeals = useMemo(() => {
    const meals = {}
    weekDates.forEach(dateKey => {
      meals[dateKey] = []
      const dayData = calendarMeals[dateKey]
      if (!dayData) return

      MEAL_SLOTS.forEach(slot => {
        if (slot === 'snacks') {
          (dayData.snacks || []).forEach(meal => {
            if (meal) meals[dateKey].push(meal)
          })
        } else if (dayData[slot]) {
          meals[dateKey].push(dayData[slot])
        }
      })
    })
    return meals
  }, [calendarMeals, weekDates])

  // Fetch nutrition data for all meals
  useEffect(() => {
    const fetchNutrition = async () => {
      setLoading(true)
      const meals = view === 'week' ? getWeekMeals : getCalendarMeals
      const days = view === 'week' ? DAYS : weekDates
      const nutrition = {}

      for (const day of days) {
        nutrition[day] = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          meals: [],
        }

        const dayMeals = meals[day] || []
        for (const meal of dayMeals) {
          try {
            const fullMeal = await getMealById(meal.idMeal)
            if (fullMeal) {
              const ingredients = extractIngredients(fullMeal)
              const mealNutrition = calculateRecipeNutrition(ingredients)

              nutrition[day].calories += mealNutrition.calories
              nutrition[day].protein += mealNutrition.protein
              nutrition[day].carbs += mealNutrition.carbs
              nutrition[day].fat += mealNutrition.fat
              nutrition[day].fiber += mealNutrition.fiber
              nutrition[day].meals.push({
                name: meal.strMeal,
                ...mealNutrition,
              })
            }
          } catch (error) {
            console.error('Error fetching meal nutrition:', error)
          }
        }
      }

      setNutritionData(nutrition)
      setLoading(false)
    }

    fetchNutrition()
  }, [view, getWeekMeals, getCalendarMeals, weekDates])

  // Calculate weekly totals
  const weeklyTotals = useMemo(() => {
    const days = view === 'week' ? DAYS : weekDates
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      daysWithMeals: 0,
    }

    days.forEach(day => {
      if (nutritionData[day]) {
        totals.calories += nutritionData[day].calories
        totals.protein += nutritionData[day].protein
        totals.carbs += nutritionData[day].carbs
        totals.fat += nutritionData[day].fat
        totals.fiber += nutritionData[day].fiber
        if (nutritionData[day].meals.length > 0) {
          totals.daysWithMeals++
        }
      }
    })

    return totals
  }, [nutritionData, view, weekDates])

  // Calculate daily average
  const dailyAverage = useMemo(() => {
    if (weeklyTotals.daysWithMeals === 0) return null

    return {
      calories: Math.round(weeklyTotals.calories / weeklyTotals.daysWithMeals),
      protein: Math.round((weeklyTotals.protein / weeklyTotals.daysWithMeals) * 10) / 10,
      carbs: Math.round((weeklyTotals.carbs / weeklyTotals.daysWithMeals) * 10) / 10,
      fat: Math.round((weeklyTotals.fat / weeklyTotals.daysWithMeals) * 10) / 10,
      fiber: Math.round((weeklyTotals.fiber / weeklyTotals.daysWithMeals) * 10) / 10,
    }
  }, [weeklyTotals])

  // Format day label
  const formatDayLabel = (day) => {
    if (view === 'week') {
      return day.charAt(0).toUpperCase() + day.slice(1, 3)
    }
    const date = new Date(day)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // Get full day label
  const getFullDayLabel = (day) => {
    if (view === 'week') {
      return day.charAt(0).toUpperCase() + day.slice(1)
    }
    const date = new Date(day)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  // Render progress bar
  const ProgressBar = ({ value, target, type, showLabel = true }) => {
    const percentage = Math.min((value / target) * 100, 150)
    const status = getBalanceStatus(value, target, type)
    const colors = MACRO_COLORS[type] || MACRO_COLORS.calories

    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={`font-medium ${colors.text}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          {showLabel && (
            <span className="text-gray-500 dark:text-gray-400">
              {value}{type === 'calories' ? '' : 'g'} / {target}{type === 'calories' ? '' : 'g'}
            </span>
          )}
        </div>
        <div className={`h-2 rounded-full ${colors.light} overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all ${colors.bg}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {percentage > 100 && (
          <div className="text-xs text-orange-500 dark:text-orange-400">
            +{Math.round(percentage - 100)}% over target
          </div>
        )}
      </div>
    )
  }

  // Render macro pie chart (simplified)
  const MacroChart = ({ nutrition }) => {
    const percentages = calculateMacroPercentages(nutrition)

    return (
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" className="dark:stroke-gray-700" />
            {/* Protein arc */}
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray={`${percentages.protein} ${100 - percentages.protein}`}
              strokeDashoffset="0"
            />
            {/* Carbs arc */}
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray={`${percentages.carbs} ${100 - percentages.carbs}`}
              strokeDashoffset={`-${percentages.protein}`}
            />
            {/* Fat arc */}
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeDasharray={`${percentages.fat} ${100 - percentages.fat}`}
              strokeDashoffset={`-${percentages.protein + percentages.carbs}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {nutrition.calories}
            </span>
          </div>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Protein {percentages.protein}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">Carbs {percentages.carbs}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-gray-600 dark:text-gray-400">Fat {percentages.fat}%</span>
          </div>
        </div>
      </div>
    )
  }

  // Render balance indicator
  const BalanceIndicator = ({ value, target, type }) => {
    const status = getBalanceStatus(value, target, type)
    const colorClasses = {
      green: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    }

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClasses[status.color]}`}>
        {status.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  const days = view === 'week' ? DAYS : weekDates
  const hasMeals = weeklyTotals.daysWithMeals > 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Nutrition Summary
        </h2>
        <button
          onClick={() => setShowTargetsModal(true)}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Set Goals
        </button>
      </div>

      {!hasMeals ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Add meals to your plan to see nutrition data</p>
        </div>
      ) : (
        <>
          {/* Weekly Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weekly Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'calories', label: 'Calories', value: weeklyTotals.calories, target: targets.calories * 7, unit: 'kcal', icon: '🔥' },
                { key: 'protein', label: 'Protein', value: weeklyTotals.protein, target: targets.protein * 7, unit: 'g', icon: '💪' },
                { key: 'carbs', label: 'Carbs', value: weeklyTotals.carbs, target: targets.carbs * 7, unit: 'g', icon: '🌾' },
                { key: 'fat', label: 'Fat', value: weeklyTotals.fat, target: targets.fat * 7, unit: 'g', icon: '🥑' },
                { key: 'fiber', label: 'Fiber', value: weeklyTotals.fiber, target: targets.fiber * 7, unit: 'g', icon: '🥬' },
              ].map(item => (
                <div key={item.key} className={`p-3 rounded-lg ${MACRO_COLORS[item.key].light}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{item.icon}</span>
                    <span className={`text-xs font-medium ${MACRO_COLORS[item.key].text}`}>{item.label}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.round(item.value)}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">{item.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    of {Math.round(item.target)} target
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Average with Balance */}
          {dailyAverage && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Average</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Based on {weeklyTotals.daysWithMeals} day{weeklyTotals.daysWithMeals > 1 ? 's' : ''} with meals</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Macro Chart */}
                <MacroChart nutrition={dailyAverage} />

                {/* Progress Bars */}
                <div className="flex-1 space-y-3">
                  <ProgressBar value={dailyAverage.calories} target={targets.calories} type="calories" />
                  <ProgressBar value={dailyAverage.protein} target={targets.protein} type="protein" />
                  <ProgressBar value={dailyAverage.carbs} target={targets.carbs} type="carbs" />
                  <ProgressBar value={dailyAverage.fat} target={targets.fat} type="fat" />
                  <ProgressBar value={dailyAverage.fiber} target={targets.fiber} type="fiber" />
                </div>
              </div>

              {/* Balance Indicators */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Balance:</span>
                  <BalanceIndicator value={dailyAverage.calories} target={targets.calories} type="calories" />
                  <BalanceIndicator value={dailyAverage.protein} target={targets.protein} type="protein" />
                  <BalanceIndicator value={dailyAverage.carbs} target={targets.carbs} type="carbs" />
                  <BalanceIndicator value={dailyAverage.fat} target={targets.fat} type="fat" />
                  <BalanceIndicator value={dailyAverage.fiber} target={targets.fiber} type="fiber" />
                </div>
              </div>
            </div>
          )}

          {/* Daily Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Day</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Calories</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Protein</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Carbs</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Fat</th>
                    <th className="text-right py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Fiber</th>
                    <th className="text-center py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {days.map(day => {
                    const dayData = nutritionData[day] || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, meals: [] }
                    const hasDayMeals = dayData.meals.length > 0

                    return (
                      <tr
                        key={day}
                        className={`${hasDayMeals ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer' : 'opacity-50'}`}
                        onClick={() => hasDayMeals && setSelectedDay(day)}
                      >
                        <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                          {formatDayLabel(day)}
                          {hasDayMeals && (
                            <span className="ml-1 text-xs text-gray-400">({dayData.meals.length})</span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                          {Math.round(dayData.calories)}
                        </td>
                        <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                          {Math.round(dayData.protein)}g
                        </td>
                        <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                          {Math.round(dayData.carbs)}g
                        </td>
                        <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                          {Math.round(dayData.fat)}g
                        </td>
                        <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                          {Math.round(dayData.fiber)}g
                        </td>
                        <td className="py-2 px-4 text-center">
                          {hasDayMeals && (
                            <BalanceIndicator value={dayData.calories} target={targets.calories} type="calories" />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Day Detail Modal */}
      {selectedDay && nutritionData[selectedDay] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDay(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getFullDayLabel(selectedDay)}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
              {/* Day totals */}
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: 'Cal', value: nutritionData[selectedDay].calories, color: MACRO_COLORS.calories },
                  { label: 'Prot', value: `${Math.round(nutritionData[selectedDay].protein)}g`, color: MACRO_COLORS.protein },
                  { label: 'Carb', value: `${Math.round(nutritionData[selectedDay].carbs)}g`, color: MACRO_COLORS.carbs },
                  { label: 'Fat', value: `${Math.round(nutritionData[selectedDay].fat)}g`, color: MACRO_COLORS.fat },
                  { label: 'Fiber', value: `${Math.round(nutritionData[selectedDay].fiber)}g`, color: MACRO_COLORS.fiber },
                ].map(item => (
                  <div key={item.label} className={`p-2 rounded-lg ${item.color.light}`}>
                    <div className={`text-xs ${item.color.text}`}>{item.label}</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Meal breakdown */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Meals</h4>
                {nutritionData[selectedDay].meals.map((meal, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-2">{meal.name}</div>
                    <div className="grid grid-cols-5 gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{meal.calories} kcal</span>
                      <span>{meal.protein}g prot</span>
                      <span>{meal.carbs}g carb</span>
                      <span>{meal.fat}g fat</span>
                      <span>{meal.fiber}g fiber</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Targets Modal */}
      {showTargetsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTargetsModal(false)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Nutrition Goals</h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal', step: 50 },
                { key: 'protein', label: 'Protein', unit: 'g', step: 5 },
                { key: 'carbs', label: 'Carbs', unit: 'g', step: 10 },
                { key: 'fat', label: 'Fat', unit: 'g', step: 5 },
                { key: 'fiber', label: 'Fiber', unit: 'g', step: 1 },
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {item.label} ({item.unit})
                  </label>
                  <input
                    type="number"
                    value={targets[item.key]}
                    onChange={e => setTargets(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                    step={item.step}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setTargets(DEFAULT_DAILY_TARGETS)}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={() => setShowTargetsModal(false)}
                  className="flex-1 btn btn-primary text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
