import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useOffline } from '../context/OfflineContext'
import RecipeGrid from '../components/Recipe/RecipeGrid'

export default function Favorites() {
  const { favorites } = useApp()
  const { isOnline, cachedRecipeIds } = useOffline()

  // Count how many favorites are cached
  const cachedCount = favorites.filter(f => cachedRecipeIds.includes(f.idMeal)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Favorites</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your saved recipes for quick access
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring and save your favorite recipes
          </p>
          <Link to="/search" className="btn btn-primary">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              You have <span className="font-semibold text-gray-900 dark:text-white">{favorites.length}</span> saved recipes
            </p>
            {/* Offline availability indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-emerald-700 dark:text-emerald-300">
                {cachedCount === favorites.length
                  ? 'All available offline'
                  : `${cachedCount} of ${favorites.length} available offline`
                }
              </span>
            </div>
          </div>

          {/* Offline notice */}
          {!isOnline && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">You're offline</p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Viewing your cached favorites. Some features may be limited.
                </p>
              </div>
            </div>
          )}

          <RecipeGrid meals={favorites} loading={false} />
        </>
      )}
    </div>
  )
}
