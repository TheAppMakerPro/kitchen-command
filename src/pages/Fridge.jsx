import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIngredients, useIngredientSearch } from '../hooks/useMeals'
import { useApp } from '../context/AppContext'
import { RecipeCardSkeleton } from '../components/Recipe/RecipeCard'
import ProgressiveImage from '../components/ui/ProgressiveImage'
import { InlineError } from '../components/ui/ErrorBoundary'

export default function Fridge() {
  const [searchTerm, setSearchTerm] = useState('')
  const { ingredients: allIngredients, loading: ingredientsLoading, error: ingredientsError, retry: retryIngredients } = useIngredients()
  const {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    results,
    matchCounts,
    loading: searchLoading,
    error: searchError,
    retry: retrySearch,
  } = useIngredientSearch()
  const { isFavorite, addFavorite, removeFavorite } = useApp()

  // Filter ingredients based on search term
  const filteredIngredients = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase()
    return allIngredients
      .filter(ing =>
        ing.toLowerCase().includes(term) &&
        !selectedIngredients.includes(ing)
      )
      .slice(0, 8) // Limit suggestions
  }, [allIngredients, searchTerm, selectedIngredients])

  // Popular/common ingredients for quick selection
  const quickIngredients = [
    'Chicken', 'Beef', 'Salmon', 'Eggs', 'Rice', 'Pasta',
    'Tomatoes', 'Onion', 'Garlic', 'Cheese', 'Butter', 'Milk'
  ].filter(ing => !selectedIngredients.includes(ing))

  const handleSelectIngredient = (ingredient) => {
    addIngredient(ingredient)
    setSearchTerm('')
  }

  const handleFavoriteClick = (e, meal) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite(meal.idMeal)) {
      removeFavorite(meal.idMeal)
    } else {
      addFavorite(meal)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg mb-4">
          <span className="text-3xl">🧊</span>
        </div>
        <h1 className="section-title mb-3">
          What's in Your <span className="gradient-text">Fridge</span>?
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add ingredients you have and we'll find recipes you can make
        </p>
      </div>

      {/* Ingredient Input */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type an ingredient (e.g., chicken, tomatoes, rice...)"
            className="input pl-11 pr-4 bg-white dark:bg-gray-800"
            disabled={ingredientsLoading}
          />

          {/* Autocomplete Dropdown */}
          {filteredIngredients.length > 0 && (
            <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {filteredIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => handleSelectIngredient(ingredient)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                  <span className="text-gray-900 dark:text-white">{ingredient}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ingredients Loading Error */}
        {ingredientsError && (
          <div className="mt-4">
            <InlineError
              message={`Failed to load ingredients: ${ingredientsError}`}
              onRetry={retryIngredients}
            />
          </div>
        )}

        {/* Quick Add Ingredients */}
        {selectedIngredients.length === 0 && !ingredientsError && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {quickIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => addIngredient(ingredient)}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  + {ingredient}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-lg">🧺</span>
                Your Ingredients
                <span className="text-sm font-normal text-gray-500">({selectedIngredients.length})</span>
              </h2>
              <button
                onClick={clearIngredients}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Remove ${ingredient}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {/* Add more ingredients hint */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {quickIngredients.slice(0, 6).map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => addIngredient(ingredient)}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    + {ingredient}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {selectedIngredients.length > 0 && (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {searchLoading ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-10 h-10 skeleton rounded-xl" />
                  <div>
                    <div className="skeleton h-5 w-32 mb-1 rounded" />
                    <div className="skeleton h-4 w-24 rounded" />
                  </div>
                </div>
              ) : (
                <>
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{results.length}</span>
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Recipes You Can Make
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sorted by ingredient match
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error State */}
          {searchError && !searchLoading && (
            <div className="py-4">
              <InlineError
                message={`Failed to search recipes: ${searchError}`}
                onRetry={retrySearch}
              />
            </div>
          )}

          {/* Recipe Grid */}
          {searchLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          )}
          {!searchLoading && !searchError && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((meal) => {
                const matchCount = matchCounts[meal.idMeal] || 0
                const favorite = isFavorite(meal.idMeal)

                return (
                  <Link
                    key={meal.idMeal}
                    to={`/recipe/${meal.idMeal}`}
                    className="group card card-hover-glow overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ProgressiveImage
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                        aspectRatio="4/3"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Match Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
                          matchCount === selectedIngredients.length
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                            : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200'
                        }`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {matchCount}/{selectedIngredients.length}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, meal)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
                          favorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                        }`}
                        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={favorite ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {meal.strMeal}
                      </h3>
                      {matchCount === selectedIngredients.length && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                          Uses all your ingredients!
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!searchLoading && results.length === 0 && selectedIngredients.length > 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <span className="text-4xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try removing some ingredients or adding different ones to find matching recipes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State - No ingredients selected */}
      {selectedIngredients.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full mb-4">
            <span className="text-4xl">🥗</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Add ingredients to get started
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Type in the search box above or click the quick add buttons to add ingredients you have on hand.
          </p>
        </div>
      )}
    </div>
  )
}
