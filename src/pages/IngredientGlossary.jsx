import { useState, useMemo } from 'react'
import { INGREDIENT_CATEGORIES, INGREDIENTS, getIngredientsByCategory, searchIngredients, getRelatedIngredients } from '../data/ingredientGlossary'

export default function IngredientGlossary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedIngredient, setSelectedIngredient] = useState(null)

  // Filter ingredients
  const filteredIngredients = useMemo(() => {
    if (searchQuery) {
      return searchIngredients(searchQuery)
    }
    if (selectedCategory) {
      return getIngredientsByCategory(selectedCategory)
    }
    return INGREDIENTS
  }, [searchQuery, selectedCategory])

  // Get related ingredients for selected
  const relatedIngredients = useMemo(() => {
    if (!selectedIngredient) return []
    return getRelatedIngredients(selectedIngredient.id)
  }, [selectedIngredient])

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ingredient Glossary</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover ingredients, their uses, and perfect substitutes
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
          placeholder="Search ingredients, flavors, or uses..."
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {INGREDIENT_CATEGORIES.map(cat => (
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
        {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''} found
      </div>

      {/* Ingredients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIngredients.map(ingredient => {
          const category = INGREDIENT_CATEGORIES.find(c => c.id === ingredient.category)
          return (
            <button
              key={ingredient.id}
              onClick={() => setSelectedIngredient(ingredient)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ingredient.name}</h3>
                </div>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
                  {ingredient.origin}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {ingredient.description}
              </p>
              <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {ingredient.substitutes.length} substitute{ingredient.substitutes.length !== 1 ? 's' : ''} available
              </div>
            </button>
          )
        })}
      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedIngredient(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-amber-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {INGREDIENT_CATEGORIES.find(c => c.id === selectedIngredient.category)?.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedIngredient.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedIngredient.origin}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {INGREDIENT_CATEGORIES.find(c => c.id === selectedIngredient.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIngredient(null)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                <p className="text-gray-700 dark:text-gray-300 text-lg">{selectedIngredient.description}</p>
              </div>

              {/* Flavor Profile */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <span>👅</span> Flavor Profile
                </h3>
                <p className="text-purple-800 dark:text-purple-200">{selectedIngredient.flavor}</p>
              </div>

              {/* Forms Available */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>📦</span> Available Forms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.forms.map((form, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      {form}
                    </span>
                  ))}
                </div>
              </div>

              {/* Common Uses */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>🍳</span> Commonly Used In
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.usedIn.map((use, idx) => (
                    <span key={idx} className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Substitutes */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🔄</span> Substitutes
                </h3>
                <div className="space-y-2">
                  {selectedIngredient.substitutes.map((sub, idx) => (
                    <div key={idx} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                      <div className="font-medium text-green-800 dark:text-green-300">{sub.name}</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">{sub.ratio}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>💡</span> Tips & Notes
                </h3>
                <div className="space-y-2">
                  {selectedIngredient.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <span className="text-amber-500">✦</span>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfect Pairings */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>🤝</span> Pairs Well With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.pairings.map((pairing, idx) => (
                    <span key={idx} className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm">
                      {pairing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Ingredients */}
              {relatedIngredients.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>🔗</span> Related Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedIngredients.map(related => (
                      <button
                        key={related.id}
                        onClick={() => setSelectedIngredient(related)}
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
