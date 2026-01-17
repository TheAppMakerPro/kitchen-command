import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMeal } from '../hooks/useMeals'
import { useApp } from '../context/AppContext'
import RecipeDetail, { RecipeDetailSkeleton } from '../components/Recipe/RecipeDetail'
import { ErrorDisplay, NotFoundError, NetworkError } from '../components/ui/ErrorBoundary'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { meal, loading, error, retry } = useMeal(id)
  const { addRecentlyViewed } = useApp()

  // Track recently viewed
  useEffect(() => {
    if (meal) {
      addRecentlyViewed({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory,
        strArea: meal.strArea,
      })
    }
  }, [meal, addRecentlyViewed])

  if (loading) {
    return <RecipeDetailSkeleton />
  }

  // Network error - show retry option
  if (error) {
    const isNetworkError = error.toLowerCase().includes('network') ||
                           error.toLowerCase().includes('fetch') ||
                           error.toLowerCase().includes('failed')

    if (isNetworkError) {
      return (
        <div className="py-12">
          <NetworkError onRetry={retry} />
        </div>
      )
    }

    return (
      <div className="py-12">
        <ErrorDisplay
          title="Couldn't Load Recipe"
          message={error}
          onRetry={retry}
          onGoBack={() => navigate(-1)}
          onGoHome={() => navigate('/')}
          size="lg"
        />
      </div>
    )
  }

  // Recipe not found
  if (!meal) {
    return (
      <div className="py-12">
        <NotFoundError
          title="Recipe Not Found"
          message="We couldn't find the recipe you're looking for. It may have been removed or the link might be incorrect."
          onGoBack={() => navigate(-1)}
          onGoHome={() => navigate('/search')}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary-500 whitespace-nowrap">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/search" className="hover:text-primary-500 whitespace-nowrap">Recipes</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-[300px] md:max-w-none" aria-current="page">
            {meal.strMeal}
          </li>
        </ol>
      </nav>

      <RecipeDetail meal={meal} />
    </div>
  )
}
