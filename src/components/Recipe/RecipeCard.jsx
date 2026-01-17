import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOfflineActions } from '../../hooks/useOfflineActions'
import { countIngredients, estimateCookingTime, estimateDifficulty, estimateServings } from '../../api/mealdb'
import { detectAllergens, getDietaryBadges, matchesDietaryTypes } from '../../data/dietaryData'
import ProgressiveImage from '../ui/ProgressiveImage'

// Difficulty badge colors
const difficultyConfig = {
  Easy: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50', icon: '🟢' },
  Medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/50', icon: '🟡' },
  Hard: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/50', icon: '🔴' },
}

export default function RecipeCard({ meal, showCategory = true, showDetails = true }) {
  const { isFavorite, addFavorite, removeFavorite, markAsCooked, getCookedCount, dietaryPreferences } = useOfflineActions()
  const favorite = isFavorite(meal.idMeal)
  const cookedCount = getCookedCount(meal.idMeal)

  // Calculate metadata
  const ingredientCount = countIngredients(meal)
  const cookingTime = estimateCookingTime(meal)
  const difficulty = estimateDifficulty(meal)
  const servings = estimateServings(meal)
  const difficultyStyle = difficultyConfig[difficulty] || difficultyConfig.Easy

  // Dietary analysis
  const detectedAllergens = detectAllergens(meal)
  const dietaryBadges = getDietaryBadges(meal)
  const showAllergenWarnings = dietaryPreferences?.showAllergenWarnings ?? true
  const userAllergens = dietaryPreferences?.allergenFree || []

  // Check if any detected allergens match user's allergen-free preferences
  const relevantAllergens = detectedAllergens.filter((a) => userAllergens.includes(a.id))
  const hasRelevantAllergens = relevantAllergens.length > 0

  // Animation states for optimistic UI feedback
  const [favoriteAnimating, setFavoriteAnimating] = useState(false)
  const [cookedAnimating, setCookedAnimating] = useState(false)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Trigger animation immediately for optimistic feedback
    setFavoriteAnimating(true)
    setTimeout(() => setFavoriteAnimating(false), 400)

    if (favorite) {
      removeFavorite(meal.idMeal)
    } else {
      addFavorite(meal)
    }
  }

  const handleCookedClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Trigger animation immediately for optimistic feedback
    setCookedAnimating(true)
    setTimeout(() => setCookedAnimating(false), 300)

    markAsCooked(meal.idMeal)
  }

  return (
    <Link to={`/recipe/${meal.idMeal}`} className="group block">
      <div className="card card-hover-glow overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <ProgressiveImage
            src={meal.strMealThumb}
            alt={`Photo of ${meal.strMeal}${meal.strCategory ? `, a ${meal.strCategory} dish` : ''}${meal.strArea ? ` from ${meal.strArea} cuisine` : ''}`}
            className="w-full h-full transition-transform duration-500 group-hover:scale-110"
            aspectRatio="4/3"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {/* Category Badge */}
            {showCategory && meal.strCategory && (
              <span className="badge bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm">
                {meal.strCategory}
              </span>
            )}
            {/* Cooking Time Badge */}
            {showDetails && cookingTime && (
              <span className="badge bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 shadow-sm">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="sr-only">Cooking time:</span> {cookingTime} min
              </span>
            )}
          </div>

          {/* Top Right Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            {/* Favorite Button - min 44x44 touch target */}
            <button
              onClick={handleFavoriteClick}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 transform
                ${favorite
                  ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-500 hover:text-rose-500 shadow-sm hover:shadow-md'
                }
                ${favoriteAnimating ? 'animate-heart-pop' : ''}
                active:scale-95`}
              aria-label={favorite ? `Remove ${meal.strMeal} from favorites` : `Add ${meal.strMeal} to favorites`}
              aria-pressed={favorite}
            >
              <svg
                className={`w-5 h-5 ${favoriteAnimating && !favorite ? 'text-rose-500' : ''}`}
                fill={favorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Cooked It Button - min 44x44 touch target */}
            <button
              onClick={handleCookedClick}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-300 transform
                ${cookedCount > 0
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-500 hover:text-emerald-500 shadow-sm hover:shadow-md'
                }
                ${cookedAnimating ? 'animate-success-pop' : ''}
                active:scale-95`}
              aria-label={cookedCount > 0 ? `Mark ${meal.strMeal} as cooked again (cooked ${cookedCount} time${cookedCount > 1 ? 's' : ''})` : `Mark ${meal.strMeal} as cooked`}
              title={cookedCount > 0 ? `Cooked ${cookedCount} time${cookedCount > 1 ? 's' : ''}` : 'Mark as cooked'}
            >
              {cookedCount > 0 ? (
                <span className={`text-xs font-bold ${cookedAnimating ? 'animate-success-pop' : ''}`} aria-hidden="true">
                  {cookedCount > 9 ? '9+' : cookedCount}
                </span>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* View Button - visible on touch devices, hover on desktop */}
          <div className="absolute bottom-3 left-3 right-3 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:transform sm:translate-y-2 sm:group-hover:translate-y-0">
            <span className="btn btn-primary w-full text-sm py-2.5 min-h-[44px] flex items-center justify-center">
              View Recipe
            </span>
          </div>

          {/* Allergen Warning - Prominent overlay when user has allergen preferences */}
          {showAllergenWarnings && hasRelevantAllergens && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-600/95 to-rose-600/80 backdrop-blur-sm p-2"
              role="alert"
              aria-label={`Warning: Contains ${relevantAllergens.map((a) => a.name).join(', ')}`}
            >
              <div className="flex items-center gap-2 text-white">
                <span className="flex-shrink-0 text-lg" aria-hidden="true">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">
                    Contains: {relevantAllergens.map((a) => a.name).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {meal.strMeal}
          </h3>

          {/* Dietary Badges */}
          {dietaryBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {dietaryBadges.slice(0, 3).map((badge) => (
                <span
                  key={badge.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  title={badge.source === 'category' ? 'From recipe category' : 'Based on ingredients'}
                >
                  <span aria-hidden="true">{badge.icon}</span>
                  {badge.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info Row */}
          {showDetails && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs" aria-label="Recipe details">
              {/* Difficulty */}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded ${difficultyStyle.bg} ${difficultyStyle.color}`}>
                <span className="mr-1 text-[10px]" aria-hidden="true">{difficultyStyle.icon}</span>
                <span className="sr-only">Difficulty:</span> {difficulty}
              </span>

              {/* Servings */}
              <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="sr-only">Servings:</span> {servings}
              </span>

              {/* Ingredient Count */}
              {ingredientCount > 0 && (
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="sr-only">Ingredients:</span> {ingredientCount}
                </span>
              )}

              {/* Cuisine */}
              {meal.strArea && (
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400 ml-auto">
                  <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="sr-only">Cuisine:</span> {meal.strArea}
                </span>
              )}
            </div>
          )}

          {/* Simple view for cards without details */}
          {!showDetails && meal.strArea && (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="sr-only">Cuisine:</span> {meal.strArea}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function RecipeCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3]" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton h-4 w-12 rounded" />
          <div className="skeleton h-4 w-8 rounded" />
          <div className="skeleton h-4 w-8 rounded" />
        </div>
      </div>
    </div>
  )
}
