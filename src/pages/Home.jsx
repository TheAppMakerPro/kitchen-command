import { Link } from 'react-router-dom'
import { useCategories, useRandomMeal, useQuickRecipes, useSeasonalPicks, useRecommendations } from '../hooks/useMeals'
import { useApp } from '../context/AppContext'
import RecipeCard, { RecipeCardSkeleton } from '../components/Recipe/RecipeCard'
import { InlineError } from '../components/ui/ErrorBoundary'

// Horizontal scrollable recipe row component
function RecipeRow({ recipes, loading, error, onRetry, skeletonCount = 4 }) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[280px] sm:w-64">
            <RecipeCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4">
        <InlineError message={`Failed to load recipes: ${error}`} onRetry={onRetry} />
      </div>
    )
  }

  if (!recipes || recipes.length === 0) return null

  return (
    <div className="relative">
      {/* Scroll container with edge-to-edge on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
        {recipes.map((meal) => (
          <div key={meal.idMeal} className="flex-shrink-0 w-[280px] sm:w-64 snap-start">
            <RecipeCard meal={meal} />
          </div>
        ))}
      </div>
      {/* Fade indicator on right edge (desktop only) */}
      {recipes.length > 3 && (
        <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
      )}
    </div>
  )
}

export default function Home() {
  const { categories, loading: categoriesLoading, error: categoriesError, retry: retryCategories } = useCategories()
  const { meal: randomMeal, loading: randomLoading, error: randomError, refresh } = useRandomMeal()
  const { recipes: quickRecipes, loading: quickLoading } = useQuickRecipes(8)
  const { picks: seasonalPicks, season, loading: seasonalLoading } = useSeasonalPicks(8)
  const { favorites, recentlyViewed } = useApp()
  const { recommendations, basedOn, loading: recsLoading } = useRecommendations(favorites, 8)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-12 md:py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-pink-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Discover 1000+ recipes
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-slide-up">
            <span className="text-gray-900 dark:text-white">Cook </span>
            <span className="gradient-text">Delicious</span>
            <br />
            <span className="text-gray-900 dark:text-white">Meals Today</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 text-balance animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Find recipes, plan meals, and create shopping lists - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/search" className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Start Exploring
            </Link>
            <Link to="/fridge" className="btn btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              <span className="mr-2">🧊</span>
              What's in My Fridge?
            </Link>
          </div>
        </div>
      </section>

      {/* Continue Cooking - Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg shadow-indigo-500/25">
                  <span className="text-xl">🕐</span>
                </span>
                Continue Cooking
              </h2>
              <p className="section-subtitle">Pick up where you left off</p>
            </div>
          </div>
          <RecipeRow recipes={recentlyViewed} loading={false} />
        </section>
      )}

      {/* Personalized Recommendations */}
      {favorites.length > 0 && (recommendations.length > 0 || recsLoading) && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl shadow-lg shadow-pink-500/25">
                  <span className="text-xl">💡</span>
                </span>
                Because You Liked
              </h2>
              {basedOn && (
                <p className="section-subtitle">
                  Based on your love for <span className="font-medium text-gray-900 dark:text-white">{basedOn.strMeal}</span>
                </p>
              )}
            </div>
            <Link to="/favorites" className="link hidden sm:flex items-center gap-1">
              View Favorites
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <RecipeRow recipes={recommendations} loading={recsLoading} />
        </section>
      )}

      {/* Today's Spotlight */}
      <section>
        <div className="text-center mb-6">
          <h2 className="section-title flex items-center justify-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/25">
              <span className="text-xl">✨</span>
            </span>
            Today's Spotlight
          </h2>
          <p className="section-subtitle">A hand-picked recipe just for you</p>
          <button
            onClick={refresh}
            disabled={randomLoading}
            className="btn btn-secondary mt-4"
          >
            <svg className={`w-4 h-4 mr-2 ${randomLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Surprise Me
          </button>
        </div>

        {randomLoading ? (
          <div className="max-w-sm mx-auto">
            <RecipeCardSkeleton />
          </div>
        ) : randomError ? (
          <div className="py-4">
            <InlineError message={`Failed to load: ${randomError}`} onRetry={refresh} />
          </div>
        ) : randomMeal ? (
          <div className="max-w-sm mx-auto">
            <RecipeCard meal={randomMeal} />
          </div>
        ) : null}
      </section>

      {/* Quick & Easy */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-teal-500/25">
                <span className="text-xl">⚡</span>
              </span>
              Quick & Easy
            </h2>
            <p className="section-subtitle">Simple recipes when you're short on time</p>
          </div>
          <Link to="/search?category=Breakfast" className="link hidden sm:flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <RecipeRow recipes={quickRecipes} loading={quickLoading} />
      </section>

      {/* Seasonal Picks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl shadow-lg shadow-violet-500/25">
                <span className="text-xl">
                  {season === 'Spring' ? '🌸' : season === 'Summer' ? '☀️' : season === 'Autumn' ? '🍂' : '❄️'}
                </span>
              </span>
              {season} Favorites
            </h2>
            <p className="section-subtitle">Perfect recipes for the season</p>
          </div>
        </div>
        <RecipeRow recipes={seasonalPicks} loading={seasonalLoading} />
      </section>

      {/* Browse Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl shadow-lg shadow-purple-500/25">
                <span className="text-xl">🍳</span>
              </span>
              Browse Categories
            </h2>
            <p className="section-subtitle">Explore recipes by category</p>
          </div>
          <Link to="/search" className="link hidden sm:flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-2xl" />
            ))}
          </div>
        ) : categoriesError ? (
          <div className="py-4">
            <InlineError message={`Failed to load categories: ${categoriesError}`} onRetry={retryCategories} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category, index) => (
              <Link
                key={category.idCategory}
                to={`/search?category=${encodeURIComponent(category.strCategory)}`}
                className="group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={category.strCategoryThumb}
                  alt={category.strCategory}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-white font-semibold text-sm drop-shadow-lg">
                    {category.strCategory}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features / Quick Links */}
      <section>
        <div className="text-center mb-8">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Powerful features to help you discover, plan, and cook amazing meals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/favorites"
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 border border-rose-200/50 dark:border-rose-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl shadow-lg shadow-rose-500/25 mb-4 group-hover:scale-110 transition-transform">
                <span className="text-xl">❤️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Favorites</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Save your favorite recipes for easy access
              </p>
              {favorites.length > 0 && (
                <span className="mt-3 inline-block text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {favorites.length} saved
                </span>
              )}
            </div>
          </Link>

          <Link
            to="/meal-planner"
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 mb-4 group-hover:scale-110 transition-transform">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Meal Planner</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Plan your weekly meals with ease
              </p>
            </div>
          </Link>

          <Link
            to="/shopping-list"
            className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/25 mb-4 group-hover:scale-110 transition-transform">
                <span className="text-xl">🛒</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Shopping List</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Auto-generate lists from your meal plan
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Learn Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="section-title flex items-center justify-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-400 to-gray-500 rounded-xl shadow-lg shadow-gray-500/25">
              <span className="text-xl">📖</span>
            </span>
            Level Up Your Cooking
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Explore techniques, ingredients, and guides to become a better cook
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            to="/techniques"
            className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-slate-400 to-gray-500 rounded-xl shadow-lg shadow-gray-500/25 mb-3 group-hover:scale-110 transition-transform">
                <span className="text-lg">🔪</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Techniques</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Master essential cooking skills
              </p>
            </div>
          </Link>

          <Link
            to="/ingredients"
            className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-lime-50 to-green-100 dark:from-lime-900/30 dark:to-green-900/30 border border-lime-200/50 dark:border-lime-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lime-400/20 to-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl shadow-lg shadow-green-500/25 mb-3 group-hover:scale-110 transition-transform">
                <span className="text-lg">🧄</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Ingredients</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Learn about ingredients & substitutes
              </p>
            </div>
          </Link>

          <Link
            to="/seasonal"
            className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg shadow-amber-500/25 mb-3 group-hover:scale-110 transition-transform">
                <span className="text-lg">🍂</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Seasonal</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                What's fresh right now
              </p>
            </div>
          </Link>

          <Link
            to="/calculator"
            className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl shadow-lg shadow-blue-500/25 mb-3 group-hover:scale-110 transition-transform">
                <span className="text-lg">🧮</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Calculator</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Convert units & scale recipes
              </p>
            </div>
          </Link>

          <Link
            to="/meal-prep"
            className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 border border-teal-200/50 dark:border-teal-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg shadow-cyan-500/25 mb-3 group-hover:scale-110 transition-transform">
                <span className="text-lg">📦</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Meal Prep</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Batch cooking guides & tips
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
