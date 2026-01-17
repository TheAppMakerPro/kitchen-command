import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TECHNIQUE_CATEGORIES, TECHNIQUES, getTechniquesByCategory, searchTechniques, getRelatedTechniques } from '../data/techniqueLibrary'
import { searchMeals } from '../api/mealdb'

// Difficulty display
const DifficultyBadge = ({ level }) => {
  const labels = ['Easy', 'Easy', 'Medium', 'Hard', 'Expert']
  const colors = [
    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  ]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level - 1]}`}>
      {labels[level - 1]}
    </span>
  )
}

export default function TechniqueLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTechnique, setSelectedTechnique] = useState(null)
  const [relatedRecipes, setRelatedRecipes] = useState([])
  const [recipesLoading, setRecipesLoading] = useState(false)

  // Filter techniques
  const filteredTechniques = useMemo(() => {
    if (searchQuery) {
      return searchTechniques(searchQuery)
    }
    if (selectedCategory) {
      return getTechniquesByCategory(selectedCategory)
    }
    return TECHNIQUES
  }, [searchQuery, selectedCategory])

  // Get related techniques for selected
  const relatedTechniques = useMemo(() => {
    if (!selectedTechnique) return []
    return getRelatedTechniques(selectedTechnique.id)
  }, [selectedTechnique])

  // Fetch related recipes when technique is selected
  useEffect(() => {
    if (!selectedTechnique || !selectedTechnique.recipeSearchTerms) {
      setRelatedRecipes([])
      return
    }

    const fetchRecipes = async () => {
      setRecipesLoading(true)
      try {
        // Search for recipes using the first search term
        const searchTerms = selectedTechnique.recipeSearchTerms
        const allRecipes = []

        // Fetch recipes for up to 2 search terms to get variety
        for (const term of searchTerms.slice(0, 2)) {
          const results = await searchMeals(term)
          if (results) {
            allRecipes.push(...results)
          }
        }

        // Remove duplicates and limit to 6 recipes
        const uniqueRecipes = allRecipes.filter((recipe, index, self) =>
          index === self.findIndex(r => r.idMeal === recipe.idMeal)
        ).slice(0, 6)

        setRelatedRecipes(uniqueRecipes)
      } catch (error) {
        console.error('Error fetching related recipes:', error)
        setRelatedRecipes([])
      } finally {
        setRecipesLoading(false)
      }
    }

    fetchRecipes()
  }, [selectedTechnique])

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Technique Library</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master essential cooking techniques with step-by-step guides
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedCategory(null)
          }}
          placeholder="Search techniques..."
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {TECHNIQUE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? 's' : ''} found
      </div>

      {/* Techniques Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechniques.map(technique => {
          const category = TECHNIQUE_CATEGORIES.find(c => c.id === technique.category)
          return (
            <button
              key={technique.id}
              onClick={() => setSelectedTechnique(technique)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{technique.name}</h3>
                </div>
                <DifficultyBadge level={technique.difficulty} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {technique.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {technique.usedFor.slice(0, 3).map((use, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {use}
                  </span>
                ))}
                {technique.usedFor.length > 3 && (
                  <span className="text-xs text-gray-400">+{technique.usedFor.length - 3} more</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTechnique(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {TECHNIQUE_CATEGORIES.find(c => c.id === selectedTechnique.category)?.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTechnique.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <DifficultyBadge level={selectedTechnique.difficulty} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {TECHNIQUE_CATEGORIES.find(c => c.id === selectedTechnique.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTechnique(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-lg">{selectedTechnique.description}</p>
              </div>

              {/* Used For */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>🍳</span> Common Uses
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTechnique.usedFor.map((use, idx) => (
                    <span key={idx} className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📝</span> Step-by-Step
                </h3>
                <div className="space-y-3">
                  {selectedTechnique.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>💡</span> Pro Tips
                </h3>
                <div className="space-y-2">
                  {selectedTechnique.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <span className="text-amber-500">✦</span>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Search Link */}
              <div>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedTechnique.videoKeywords)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300">Watch Video Tutorials</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Search "{selectedTechnique.videoKeywords}" on YouTube</p>
                  </div>
                  <svg className="w-5 h-5 text-red-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Related Recipes */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🍽️</span> Try This Technique With
                </h3>
                {recipesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : relatedRecipes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {relatedRecipes.map(recipe => (
                      <Link
                        key={recipe.idMeal}
                        to={`/recipe/${recipe.idMeal}`}
                        onClick={() => setSelectedTechnique(null)}
                        className="group"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {recipe.strMeal}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {recipe.strCategory}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No related recipes found.</p>
                )}
              </div>

              {/* Related Techniques */}
              {relatedTechniques.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>🔗</span> Related Techniques
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedTechniques.map(related => (
                      <button
                        key={related.id}
                        onClick={() => {
                          setRelatedRecipes([])
                          setSelectedTechnique(related)
                        }}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        {related.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
