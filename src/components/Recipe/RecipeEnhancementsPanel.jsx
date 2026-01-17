import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { extractIngredients } from '../../api/mealdb'
import { getRecipeEnhancements } from '../../data/recipeEnhancements'
import { calculateRecipeNutrition } from '../../data/nutritionData'

// Difficulty star renderer
const DifficultyStars = ({ level }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= level ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Dietary tag colors
const TAG_COLORS = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800',
}

// Wine type colors
const WINE_COLORS = {
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  white: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  rosé: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  sparkling: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  fortified: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  dessert: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

export default function RecipeEnhancementsPanel({ meal }) {
  const [expandedSection, setExpandedSection] = useState(null)

  // Get all enhancements
  const enhancements = useMemo(() => getRecipeEnhancements(meal), [meal])

  // Get nutrition data
  const ingredients = useMemo(() => extractIngredients(meal), [meal])
  const nutrition = useMemo(() => calculateRecipeNutrition(ingredients), [ingredients])

  const { times, difficulty, servings, dietaryTags, equipment, chefTips, winePairings, sideDishes, cuisineInfo } = enhancements

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="space-y-6">
      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Prep Time */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🔪</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Prep Time</div>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{times.prepTime} min</div>
        </div>

        {/* Cook Time */}
        <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Cook Time</div>
          <div className="text-lg font-bold text-orange-700 dark:text-orange-300">{times.cookTime} min</div>
        </div>

        {/* Total Time */}
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">⏱️</div>
          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Total Time</div>
          <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{times.totalTime} min</div>
        </div>

        {/* Servings */}
        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🍽️</div>
          <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Servings</div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">{servings.servings}</div>
          <div className="text-xs text-green-600 dark:text-green-400">{servings.yield}</div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Difficulty</div>
              <div className="font-semibold text-gray-900 dark:text-white">{difficulty.label}</div>
            </div>
          </div>
          <DifficultyStars level={difficulty.level} />
        </div>
      </div>

      {/* Dietary Tags */}
      {dietaryTags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🏷️</span>
            Dietary Information
          </h3>
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map(tag => (
              <span
                key={tag.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${TAG_COLORS[tag.color] || TAG_COLORS.green}`}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Facts Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('nutrition')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white">Nutrition Facts</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{nutrition.calories} calories per serving</div>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'nutrition' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'nutrition' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="border-2 border-gray-900 dark:border-gray-300 rounded-lg p-4">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white border-b-8 border-gray-900 dark:border-gray-300 pb-1 mb-2">Nutrition Facts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Per serving (serves {servings.servings})</p>

              <div className="border-t-4 border-gray-900 dark:border-gray-300 pt-2">
                <div className="flex justify-between items-center py-1 border-b border-gray-300 dark:border-gray-600">
                  <span className="font-bold text-gray-900 dark:text-white">Calories</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round(nutrition.calories / servings.servings)}</span>
                </div>

                <div className="text-xs text-right text-gray-500 dark:text-gray-400 pt-1 border-b border-gray-300 dark:border-gray-600 pb-1">% Daily Value*</div>

                <div className="flex justify-between items-center py-1 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white"><span className="font-bold">Total Fat</span> {Math.round(nutrition.fat / servings.servings)}g</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round((nutrition.fat / servings.servings / 65) * 100)}%</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white"><span className="font-bold">Total Carbohydrate</span> {Math.round(nutrition.carbs / servings.servings)}g</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round((nutrition.carbs / servings.servings / 300) * 100)}%</span>
                </div>

                <div className="flex justify-between items-center py-1 pl-4 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">Dietary Fiber {Math.round(nutrition.fiber / servings.servings)}g</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round((nutrition.fiber / servings.servings / 25) * 100)}%</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b-4 border-gray-900 dark:border-gray-300">
                  <span className="text-gray-900 dark:text-white"><span className="font-bold">Protein</span> {Math.round(nutrition.protein / servings.servings)}g</span>
                  <span className="font-bold text-gray-900 dark:text-white">{Math.round((nutrition.protein / servings.servings / 50) * 100)}%</span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">* Percent Daily Values are based on a 2,000 calorie diet.</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">Estimates based on ingredients. Actual values may vary.</p>
          </div>
        )}
      </div>

      {/* Equipment Needed */}
      {equipment.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection('equipment')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Equipment Needed</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{equipment.length} item{equipment.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'equipment' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'equipment' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chef Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('tips')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
              <span className="text-lg">👨‍🍳</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white">Chef Tips</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pro tips for better results</div>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'tips' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'tips' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {chefTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-yellow-500 mt-0.5">💡</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wine Pairings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('wine')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <span className="text-lg">🍷</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white">Wine Pairings</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Suggested wines for this dish</div>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'wine' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'wine' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {winePairings.map((pairing, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${WINE_COLORS[pairing.type] || WINE_COLORS.red}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{pairing.wine}</span>
                  <span className="text-xs uppercase opacity-70">{pairing.type}</span>
                </div>
                <p className="text-sm opacity-80">{pairing.description}</p>
              </div>
            ))}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">Drink responsibly. 21+ only.</p>
          </div>
        )}
      </div>

      {/* Side Dish Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('sides')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <span className="text-lg">🥗</span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 dark:text-white">Side Dish Ideas</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complete your meal</div>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'sides' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expandedSection === 'sides' && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              {sideDishes.map((side, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-2xl">{side.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{side.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{side.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cuisine Info */}
      {meal.strArea && (
        <div className="bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-primary-100 dark:border-primary-800/50">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{cuisineInfo.flag}</span>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{meal.strArea} Cuisine</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{cuisineInfo.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
