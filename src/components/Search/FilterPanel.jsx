import { useCategories, useAreas } from '../../hooks/useMeals'
import { InlineError } from '../ui/ErrorBoundary'

export default function FilterPanel({
  selectedCategory,
  selectedArea,
  onCategoryChange,
  onAreaChange,
  onClear,
}) {
  const { categories, loading: categoriesLoading, error: categoriesError, retry: retryCategories } = useCategories()
  const { areas, loading: areasLoading, error: areasError, retry: retryAreas } = useAreas()

  const hasFilters = selectedCategory || selectedArea

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 shadow-soft">
      <div className="flex flex-wrap items-end gap-4">
        {/* Category Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          {categoriesError ? (
            <div className="py-2">
              <InlineError message="Failed to load" onRetry={retryCategories} />
            </div>
          ) : (
            <select
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="input bg-white dark:bg-gray-900"
              disabled={categoriesLoading}
            >
              <option value="">{categoriesLoading ? 'Loading...' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat.idCategory} value={cat.strCategory}>
                  {cat.strCategory}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Area Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cuisine
          </label>
          {areasError ? (
            <div className="py-2">
              <InlineError message="Failed to load" onRetry={retryAreas} />
            </div>
          ) : (
            <select
              value={selectedArea || ''}
              onChange={(e) => onAreaChange(e.target.value || null)}
              className="input bg-white dark:bg-gray-900"
              disabled={areasLoading}
            >
              <option value="">{areasLoading ? 'Loading...' : 'All Cuisines'}</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="btn btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-orange-100 dark:from-primary-900/50 dark:to-orange-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
              <span className="text-xs">🍳</span>
              {selectedCategory}
              <button
                onClick={() => onCategoryChange(null)}
                className="hover:text-primary-900 dark:hover:text-primary-100 transition-colors"
                aria-label="Remove category filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedArea && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <span className="text-xs">🌍</span>
              {selectedArea}
              <button
                onClick={() => onAreaChange(null)}
                className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                aria-label="Remove area filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
