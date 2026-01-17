import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp, DAYS, MEAL_SLOTS } from '../context/AppContext'
import PlannerGrid from '../components/MealPlanner/PlannerGrid'
import CalendarView from '../components/MealPlanner/CalendarView'
import NutritionSummary from '../components/MealPlanner/NutritionSummary'
import { getMealById, extractIngredients } from '../api/mealdb'

export default function MealPlannerPage() {
  const { mealPlan, clearMealPlan, generateShoppingList, showToast } = useApp()
  const [generating, setGenerating] = useState(false)
  const [view, setView] = useState('week') // 'week' or 'month'
  const [showNutrition, setShowNutrition] = useState(true)

  // Count total meals with the new structure
  const totalMeals = DAYS.reduce((sum, day) => {
    const dayData = mealPlan[day]
    if (!dayData) return sum

    return sum + MEAL_SLOTS.reduce((slotSum, slot) => {
      if (slot === 'snacks') {
        return slotSum + (dayData.snacks?.length || 0)
      }
      return slotSum + (dayData[slot] ? 1 : 0)
    }, 0)
  }, 0)

  // Get all meals from the plan
  const getAllMeals = () => {
    const meals = []
    DAYS.forEach(day => {
      const dayData = mealPlan[day]
      if (!dayData) return

      MEAL_SLOTS.forEach(slot => {
        if (slot === 'snacks') {
          (dayData.snacks || []).forEach(meal => {
            if (meal) meals.push(meal)
          })
        } else if (dayData[slot]) {
          meals.push(dayData[slot])
        }
      })
    })
    return meals
  }

  const handleGenerateShoppingList = async () => {
    setGenerating(true)

    try {
      // Get all meal IDs from the plan
      const allMeals = getAllMeals()
      const mealIds = allMeals.map((meal) => meal.idMeal)

      // Remove duplicates
      const uniqueIds = [...new Set(mealIds)]

      // Fetch full meal details for each
      const mealDetails = await Promise.all(
        uniqueIds.map((id) => getMealById(id))
      )

      // Extract all ingredients
      const allIngredients = mealDetails
        .filter(Boolean)
        .flatMap((meal) => extractIngredients(meal))

      // Combine duplicate ingredients
      const ingredientMap = new Map()
      allIngredients.forEach(({ ingredient, measure }) => {
        const key = ingredient.toLowerCase()
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)
          existing.measure = existing.measure
            ? `${existing.measure}, ${measure}`
            : measure
        } else {
          ingredientMap.set(key, { ingredient, measure })
        }
      })

      const combinedIngredients = Array.from(ingredientMap.values())
      generateShoppingList(combinedIngredients)
    } catch (error) {
      console.error('Error generating shopping list:', error)
      showToast('Failed to generate shopping list', 'error')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meal Planner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {view === 'week'
              ? 'Plan your meals for the week - drag and drop to rearrange'
              : 'View and plan your meals for the month'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'week'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'month'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Month
            </button>
          </div>

          {view === 'week' && totalMeals > 0 && (
            <>
              <button
                onClick={handleGenerateShoppingList}
                disabled={generating}
                className="btn btn-primary"
              >
                {generating ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Generate Shopping List
                  </>
                )}
              </button>
              <button onClick={clearMealPlan} className="btn btn-secondary">
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Week View */}
      {view === 'week' && (
        <>
          {/* Stats */}
          {totalMeals > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/30 dark:to-orange-900/30 rounded-xl p-4 flex items-center justify-between border border-primary-100 dark:border-primary-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <span className="text-lg">📅</span>
                </div>
                <span className="text-primary-700 dark:text-primary-300">
                  <span className="font-semibold">{totalMeals}</span> meal{totalMeals !== 1 ? 's' : ''} planned this week
                </span>
              </div>
              <Link
                to="/shopping-list"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1"
              >
                View Shopping List
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {/* Drag & Drop Hint */}
          {totalMeals > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span>Drag and drop meals to move them between days and meal times</span>
            </div>
          )}

          {/* Planner Grid */}
          <PlannerGrid />

          {/* Empty State Help */}
          {totalMeals === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start Planning Your Week
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Browse recipes and click "Add to Meal Plan" to organize your weekly meals by breakfast, lunch, dinner, and more.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/search" className="btn btn-primary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Recipes
                </Link>
                <Link to="/" className="btn btn-secondary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Explore Home
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Month/Calendar View */}
      {view === 'month' && <CalendarView />}

      {/* Nutrition Summary Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowNutrition(!showNutrition)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${showNutrition ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Nutrition Summary
        </button>
        {showNutrition && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Estimated values based on ingredients
          </span>
        )}
      </div>

      {/* Nutrition Summary Panel */}
      {showNutrition && <NutritionSummary view={view} />}
    </div>
  )
}
