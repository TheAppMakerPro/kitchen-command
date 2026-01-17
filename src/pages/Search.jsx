import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/Search/SearchBar'
import FilterPanel from '../components/Search/FilterPanel'
import RecipeGrid from '../components/Recipe/RecipeGrid'
import { useCombinedSearch } from '../hooks/useMeals'
import { useApp } from '../context/AppContext'
import { filterByDietaryPreferences, DIETARY_TYPES, ALLERGENS } from '../data/dietaryData'
import { InlineError } from '../components/ui/ErrorBoundary'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || null
  const initialArea = searchParams.get('area') || null

  const { dietaryPreferences } = useApp()
  const [applyDietaryFilters, setApplyDietaryFilters] = useState(true)

  const {
    query,
    setQuery,
    category,
    setCategory,
    area,
    setArea,
    results,
    loading,
    error,
    clearAll,
    retry,
  } = useCombinedSearch()

  // Check if user has any dietary preferences set
  const hasDietaryPreferences = (dietaryPreferences?.dietaryTypes?.length > 0) ||
    (dietaryPreferences?.allergenFree?.length > 0)

  // Filter results based on dietary preferences
  const filteredResults = useMemo(() => {
    if (!applyDietaryFilters || !hasDietaryPreferences) {
      return results
    }
    return filterByDietaryPreferences(results, dietaryPreferences)
  }, [results, dietaryPreferences, applyDietaryFilters, hasDietaryPreferences])

  const hiddenCount = results.length - filteredResults.length

  // Initialize from URL params on mount
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery)
    if (initialCategory) setCategory(initialCategory)
    if (initialArea) setArea(initialArea)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    if (area) params.set('area', area)
    setSearchParams(params, { replace: true })
  }, [query, category, area, setSearchParams])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    // Clear area when category is selected (they're mutually exclusive filters)
    if (newCategory) setArea(null)
  }

  const handleAreaChange = (newArea) => {
    setArea(newArea)
    // Clear category when area is selected (they're mutually exclusive filters)
    if (newArea) setCategory(null)
  }

  const handleClearFilters = () => {
    setCategory(null)
    setArea(null)
  }

  const hasQuery = query.trim() !== ''
  const hasFilter = category || area
  const hasSearchCriteria = hasQuery || hasFilter

  // Build contextual empty message
  let emptyMessage = 'Start typing to search for recipes'
  if (hasSearchCriteria && !loading && results.length === 0) {
    if (hasQuery && hasFilter) {
      emptyMessage = `No "${query}" recipes found in ${category || area}`
    } else if (hasQuery) {
      emptyMessage = `No recipes found for "${query}"`
    } else {
      emptyMessage = `No recipes found in ${category || area}`
    }
  }

  // Build results description
  const getResultsDescription = () => {
    if (hasQuery && hasFilter) {
      return (
        <>
          for "<span className="font-medium text-gray-900 dark:text-white">{query}</span>"
          {' '}in <span className="font-medium text-gray-900 dark:text-white">{category || area}</span>
        </>
      )
    } else if (hasQuery) {
      return <>for "<span className="font-medium text-gray-900 dark:text-white">{query}</span>"</>
    } else if (hasFilter) {
      return <>in <span className="font-medium text-gray-900 dark:text-white">{category || area}</span></>
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="section-title mb-3">
          <span className="gradient-text">Search</span> Recipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find the perfect recipe from our collection of delicious meals
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="What would you like to cook today?"
          large
        />
      </div>

      {/* Filters */}
      <FilterPanel
        selectedCategory={category}
        selectedArea={area}
        onCategoryChange={handleCategoryChange}
        onAreaChange={handleAreaChange}
        onClear={handleClearFilters}
      />

      {/* Active Search Info */}
      {hasQuery && hasFilter && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-primary-700 dark:text-primary-300">
            Searching "<strong>{query}</strong>" within <strong>{category || area}</strong> recipes
          </span>
          <button
            onClick={clearAll}
            className="ml-auto text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <InlineError
            message={`Failed to search: ${error}`}
            onRetry={retry}
          />
        </div>
      )}

      {/* Dietary Filter Toggle */}
      {hasDietaryPreferences && hasSearchCriteria && !loading && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">🥗</span>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Dietary Filters Active
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {dietaryPreferences.dietaryTypes?.map((t) => DIETARY_TYPES[t]?.name).filter(Boolean).join(', ')}
                {dietaryPreferences.dietaryTypes?.length > 0 && dietaryPreferences.allergenFree?.length > 0 && ' • '}
                {dietaryPreferences.allergenFree?.length > 0 && (
                  <>Avoiding: {dietaryPreferences.allergenFree?.map((a) => ALLERGENS[a]?.name).filter(Boolean).join(', ')}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {hiddenCount > 0 && (
              <span className="text-sm text-green-600 dark:text-green-400">
                {hiddenCount} recipe{hiddenCount !== 1 ? 's' : ''} hidden
              </span>
            )}
            <button
              onClick={() => setApplyDietaryFilters(!applyDietaryFilters)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                applyDietaryFilters
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'
              }`}
              aria-pressed={applyDietaryFilters}
            >
              {applyDietaryFilters ? 'Filters On' : 'Filters Off'}
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      {hasSearchCriteria && !loading && filteredResults.length > 0 && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{filteredResults.length}</span>
          </span>
          <span>
            recipes found {getResultsDescription()}
          </span>
        </div>
      )}

      {/* Results Grid */}
      <RecipeGrid
        meals={filteredResults}
        loading={loading}
        emptyMessage={emptyMessage}
      />
    </div>
  )
}
