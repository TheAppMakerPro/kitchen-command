import { useState, useMemo } from 'react'
import {
  PREP_CATEGORIES,
  PREP_GUIDES,
  PREP_STRATEGIES,
  getGuidesByCategory,
  searchGuides,
} from '../data/mealPrepGuides'

// Difficulty badge component
const DifficultyBadge = ({ level }) => {
  const colors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {level}
    </span>
  )
}

export default function MealPrepGuides() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [showStrategies, setShowStrategies] = useState(false)

  // Filter guides
  const filteredGuides = useMemo(() => {
    if (searchQuery) {
      return searchGuides(searchQuery)
    }
    if (selectedCategory) {
      return getGuidesByCategory(selectedCategory)
    }
    return PREP_GUIDES
  }, [searchQuery, selectedCategory])

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meal Prep Guides</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Master batch cooking with step-by-step tutorials
        </p>
      </div>

      {/* Prep Strategies Toggle */}
      <button
        onClick={() => setShowStrategies(!showStrategies)}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-4 flex items-center justify-between hover:from-primary-600 hover:to-primary-700 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-left">
            <p className="font-semibold">Meal Prep Strategies</p>
            <p className="text-sm text-primary-100">Learn different approaches to meal prep</p>
          </div>
        </div>
        <svg className={`w-6 h-6 transition-transform ${showStrategies ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Strategies Panel */}
      {showStrategies && (
        <div className="grid sm:grid-cols-2 gap-4">
          {PREP_STRATEGIES.map(strategy => (
            <div key={strategy.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{strategy.icon}</span>
                <h3 className="font-bold text-gray-900 dark:text-white">{strategy.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{strategy.description}</p>
              <ul className="space-y-2">
                {strategy.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-primary-500 mt-0.5">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setSelectedCategory(null)
          }}
          placeholder="Search meal prep guides..."
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {PREP_CATEGORIES.map(cat => (
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
        {filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} found
      </div>

      {/* Guides Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map(guide => {
          const category = PREP_CATEGORIES.find(c => c.id === guide.category)
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{guide.name}</h3>
                </div>
                <DifficultyBadge level={guide.difficulty} />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {guide.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  ⏱️ {guide.prepTime} prep
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  📦 {guide.yield}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  🗓️ {guide.storageLife}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-gray-500 dark:text-gray-400">No guides found matching your search.</p>
        </div>
      )}

      {/* Guide Detail Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGuide(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-amber-50 dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {PREP_CATEGORIES.find(c => c.id === selectedGuide.category)?.icon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGuide.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <DifficultyBadge level={selectedGuide.difficulty} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedGuide.yield}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Prep Time</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedGuide.prepTime}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cook Time</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedGuide.cookTime}</p>
                </div>
                <div className="bg-white/60 dark:bg-gray-700/60 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedGuide.storageLife}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)] space-y-6">
              {/* Description */}
              <div>
                <p className="text-gray-700 dark:text-gray-300">{selectedGuide.description}</p>
              </div>

              {/* Why It Works */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <span>💡</span> Why This Works
                </h3>
                <p className="text-blue-800 dark:text-blue-200">{selectedGuide.whyItWorks}</p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🛒</span> Ingredients
                </h3>
                <ul className="space-y-2">
                  {selectedGuide.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📝</span> Step-by-Step
                </h3>
                <div className="space-y-3">
                  {selectedGuide.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variations */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🎨</span> Flavor Variations
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedGuide.variations.map((variation, idx) => (
                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <div className="font-medium text-amber-900 dark:text-amber-300">{variation.name}</div>
                      <div className="text-sm text-amber-700 dark:text-amber-400 mt-1">{variation.seasonings}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Ideas */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🍽️</span> How to Use It
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.usageIdeas.map((idea, idx) => (
                    <span key={idx} className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                      {idea}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>⭐</span> Pro Tips
                </h3>
                <div className="space-y-2">
                  {selectedGuide.proTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-500">✦</span>
                      <p className="text-sm text-green-800 dark:text-green-200">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
