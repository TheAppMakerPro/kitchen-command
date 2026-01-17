import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useSmartCollection, useRecipesByIds, SMART_COLLECTIONS } from '../hooks/useMeals'
import RecipeCard, { RecipeCardSkeleton } from '../components/Recipe/RecipeCard'

// Color mappings
const colorClasses = {
  indigo: 'from-indigo-500 to-indigo-600',
  blue: 'from-blue-500 to-blue-600',
  rose: 'from-rose-500 to-rose-600',
  amber: 'from-amber-500 to-amber-600',
  emerald: 'from-emerald-500 to-emerald-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
  gray: 'from-gray-500 to-gray-600',
  red: 'from-red-500 to-red-600',
  teal: 'from-teal-500 to-teal-600',
  pink: 'from-pink-500 to-pink-600',
}

export default function CollectionDetail() {
  const { collectionId, customId } = useParams()
  const navigate = useNavigate()
  const { customCollections, removeFromCollection, deleteCollection } = useApp()

  // Determine if this is a smart collection or custom collection
  const isCustom = !!customId
  const id = customId || collectionId

  // For smart collections
  const { collection: smartCollection, recipes: smartRecipes, loading: smartLoading } = useSmartCollection(
    isCustom ? null : id
  )

  // For custom collections
  const customCollection = isCustom
    ? customCollections.find(c => c.id === id)
    : null

  const { recipes: customRecipes, loading: customLoading } = useRecipesByIds(
    customCollection?.recipeIds || []
  )

  const collection = isCustom ? customCollection : smartCollection
  const recipes = isCustom ? customRecipes : smartRecipes
  const loading = isCustom ? customLoading : smartLoading

  const handleRemoveFromCollection = (recipeId) => {
    if (customCollection) {
      removeFromCollection(customCollection.id, recipeId)
    }
  }

  const handleDeleteCollection = () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id)
      navigate('/collections')
    }
  }

  if (!collection && !loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Collection not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          This collection doesn't exist or may have been deleted.
        </p>
        <Link to="/collections" className="btn btn-primary">
          Browse Collections
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className={`relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br ${colorClasses[collection?.color || 'gray']}`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative p-8 text-white">
          <Link
            to="/collections"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Collections
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-5xl mb-4 block">{collection?.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {collection?.name}
              </h1>
              {collection?.description && (
                <p className="text-white/80 text-lg max-w-xl">
                  {collection.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-white/70">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {loading ? '...' : recipes.length} recipes
                </span>
                {collection?.type === 'smart' && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Auto-curated
                  </span>
                )}
              </div>
            </div>

            {isCustom && (
              <button
                onClick={handleDeleteCollection}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Delete collection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isCustom ? 'No recipes yet' : 'No recipes found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {isCustom
              ? 'Start adding recipes to this collection from any recipe page.'
              : 'Try refreshing the page or check back later.'}
          </p>
          {isCustom && (
            <Link to="/search" className="btn btn-primary">
              Browse Recipes
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.idMeal} className="relative group">
              <RecipeCard meal={recipe} />
              {isCustom && (
                <button
                  onClick={() => handleRemoveFromCollection(recipe.idMeal)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Remove from collection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Smart Collection Sources */}
      {!isCustom && collection && (collection.categories || collection.areas) && (
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recipe Sources
          </h3>
          <div className="flex flex-wrap gap-2">
            {(collection.categories || collection.areas || []).map(source => (
              <Link
                key={source}
                to={`/search?${collection.categories ? 'category' : 'area'}=${source}`}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {source}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
