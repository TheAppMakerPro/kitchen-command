import { useState, useMemo } from 'react'
import {
  SEASONS,
  MONTHS,
  PRODUCE_CATEGORIES,
  SEASONAL_PRODUCE,
  getProduceByMonth,
  getProduceBySeason,
  searchProduce,
  getCurrentSeason
} from '../data/seasonalGuides'

export default function SeasonalGuides() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [selectedProduce, setSelectedProduce] = useState(null)
  const [viewMode, setViewMode] = useState('month') // 'month' or 'season'

  const currentSeason = getCurrentSeason()

  // Filter produce
  const filteredProduce = useMemo(() => {
    if (searchQuery) {
      return searchProduce(searchQuery)
    }
    if (viewMode === 'season' && selectedSeason) {
      return getProduceBySeason(selectedSeason)
    }
    return getProduceByMonth(selectedMonth)
  }, [searchQuery, selectedMonth, selectedSeason, viewMode])

  // Group by category
  const produceByCategory = useMemo(() => {
    const grouped = {}
    PRODUCE_CATEGORIES.forEach(cat => {
      grouped[cat.id] = filteredProduce.filter(p => p.category === cat.id)
    })
    return grouped
  }, [filteredProduce])

  const getSeasonColor = (seasonId) => {
    const colors = {
      spring: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      summer: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      fall: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
      winter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    }
    return colors[seasonId] || ''
  }

  const getMonthSeason = (monthId) => {
    return MONTHS.find(m => m.id === monthId)?.season
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Seasonal Guides</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover what's in season and cook with the freshest produce
        </p>
      </div>

      {/* Current Season Banner */}
      <div className={`rounded-xl p-4 ${getSeasonColor(currentSeason?.id)}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentSeason?.icon}</span>
          <div>
            <p className="font-medium">It's {currentSeason?.label}!</p>
            <p className="text-sm opacity-80">
              {filteredProduce.length} items are at their peak right now
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search produce, pairings, or recipes..."
          className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* View Toggle */}
      {!searchQuery && (
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'month'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            By Month
          </button>
          <button
            onClick={() => {
              setViewMode('season')
              setSelectedSeason(currentSeason?.id)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'season'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            By Season
          </button>
        </div>
      )}

      {/* Month Selector */}
      {!searchQuery && viewMode === 'month' && (
        <div className="flex flex-wrap gap-2">
          {MONTHS.map(month => (
            <button
              key={month.id}
              onClick={() => setSelectedMonth(month.id)}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                selectedMonth === month.id
                  ? `${getSeasonColor(month.season)} ring-2 ring-offset-2 ring-primary-500`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {month.shortName}
            </button>
          ))}
        </div>
      )}

      {/* Season Selector */}
      {!searchQuery && viewMode === 'season' && (
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(season => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                selectedSeason === season.id
                  ? `${getSeasonColor(season.id)} ring-2 ring-offset-2 ring-primary-500`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{season.icon}</span>
              {season.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {filteredProduce.length} item{filteredProduce.length !== 1 ? 's' : ''} in season
      </div>

      {/* Produce Grid by Category */}
      {PRODUCE_CATEGORIES.map(category => {
        const items = produceByCategory[category.id]
        if (items.length === 0) return null

        return (
          <div key={category.id}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.label}
              <span className="text-sm font-normal text-gray-500">({items.length})</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(produce => (
                <button
                  key={produce.id}
                  onClick={() => setSelectedProduce(produce)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{produce.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{produce.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {produce.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {produce.peakMonths.slice(0, 4).map(m => {
                          const month = MONTHS.find(mon => mon.id === m)
                          return (
                            <span
                              key={m}
                              className={`text-xs px-2 py-0.5 rounded-full ${getSeasonColor(month?.season)}`}
                            >
                              {month?.shortName}
                            </span>
                          )
                        })}
                        {produce.peakMonths.length > 4 && (
                          <span className="text-xs text-gray-400">+{produce.peakMonths.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      {filteredProduce.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-gray-500 dark:text-gray-400">No produce found matching your search.</p>
        </div>
      )}

      {/* Produce Detail Modal */}
      {selectedProduce && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduce(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedProduce.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProduce.name}</h2>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedProduce.peakMonths.map(m => {
                        const month = MONTHS.find(mon => mon.id === m)
                        return (
                          <span
                            key={m}
                            className={`text-xs px-2 py-0.5 rounded-full ${getSeasonColor(month?.season)}`}
                          >
                            {month?.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduce(null)}
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
                <p className="text-gray-700 dark:text-gray-300 text-lg">{selectedProduce.description}</p>
              </div>

              {/* Selection Guide */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                  <span>🛒</span> How to Select
                </h3>
                <p className="text-green-800 dark:text-green-200">{selectedProduce.selection}</p>
              </div>

              {/* Storage */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <span>🧊</span> Storage Tips
                </h3>
                <p className="text-blue-800 dark:text-blue-200">{selectedProduce.storage}</p>
              </div>

              {/* Preparation */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🔪</span> Preparation Tips
                </h3>
                <ul className="space-y-2">
                  {selectedProduce.preparation.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-primary-500 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pairings */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>🤝</span> Pairs Well With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduce.pairings.map((pairing, idx) => (
                    <span key={idx} className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full text-sm">
                      {pairing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recipe Ideas */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📝</span> Recipe Ideas
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduce.recipes.map((recipe, idx) => (
                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm">
                      {recipe}
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
