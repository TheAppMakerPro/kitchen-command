import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { ALLERGENS, DIETARY_TYPES, HEALTH_OPTIONS } from '../data/dietaryData'

export default function DietaryPreferences({ isOpen, onClose }) {
  const {
    dietaryPreferences,
    toggleDietaryType,
    toggleAllergenFree,
    toggleHealthOption,
    updateDietaryPreference,
  } = useApp()

  const [activeTab, setActiveTab] = useState('dietary')
  const closeButtonRef = useRef(null)

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 100)

    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timeoutId)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const { dietaryTypes = [], allergenFree = [], healthOptions = [], showAllergenWarnings = true } = dietaryPreferences || {}

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dietary-title"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🥗</span>
            </div>
            <div>
              <h2 id="dietary-title" className="text-xl font-bold text-gray-900 dark:text-white">
                Dietary Preferences
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Set your dietary requirements and allergens
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dietary preferences"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Dietary preference tabs">
          <button
            role="tab"
            aria-selected={activeTab === 'dietary'}
            aria-controls="dietary-panel"
            id="dietary-tab"
            onClick={() => setActiveTab('dietary')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'dietary'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Diet Types
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'allergens'}
            aria-controls="allergens-panel"
            id="allergens-tab"
            onClick={() => setActiveTab('allergens')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'allergens'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Allergens
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'health'}
            aria-controls="health-panel"
            id="health-tab"
            onClick={() => setActiveTab('health')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'health'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Health Options
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dietary Types Tab */}
          {activeTab === 'dietary' && (
            <div
              role="tabpanel"
              id="dietary-panel"
              aria-labelledby="dietary-tab"
              className="space-y-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select your dietary preferences. Recipes will be filtered to match your selections.
              </p>
              <div className="grid gap-3">
                {Object.values(DIETARY_TYPES).map((type) => {
                  const isSelected = dietaryTypes.includes(type.id)
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleDietaryType(type.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isSelected ? 'bg-green-100 dark:bg-green-800/50' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {type.icon}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{type.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type.description}</p>
                      </div>
                      {isSelected && (
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Allergens Tab */}
          {activeTab === 'allergens' && (
            <div
              role="tabpanel"
              id="allergens-panel"
              aria-labelledby="allergens-tab"
              className="space-y-4"
            >
              {/* Warning toggle */}
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200">Show Allergen Warnings</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Display prominent warnings on recipes</p>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={showAllergenWarnings}
                  onClick={() => updateDietaryPreference('showAllergenWarnings', !showAllergenWarnings)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    showAllergenWarnings ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label="Toggle allergen warnings"
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      showAllergenWarnings ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select allergens to avoid. Recipes containing these will be flagged or filtered out.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {Object.values(ALLERGENS).map((allergen) => {
                  const isSelected = allergenFree.includes(allergen.id)
                  return (
                    <button
                      key={allergen.id}
                      onClick={() => toggleAllergenFree(allergen.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        isSelected ? 'bg-rose-100 dark:bg-rose-800/50' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {allergen.icon}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{allergen.name}</span>
                      {isSelected && (
                        <svg className="w-5 h-5 text-rose-500 ml-auto" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Health Options Tab */}
          {activeTab === 'health' && (
            <div
              role="tabpanel"
              id="health-panel"
              aria-labelledby="health-tab"
              className="space-y-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select health-conscious options. Recipes high in these ingredients will be flagged.
              </p>
              <div className="grid gap-3">
                {Object.values(HEALTH_OPTIONS).map((option) => {
                  const isSelected = healthOptions.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleHealthOption(option.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isSelected ? 'bg-blue-100 dark:bg-blue-800/50' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {option.icon}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{option.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                      </div>
                      {isSelected && (
                        <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mt-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Note:</span> Nutritional information is estimated based on common ingredients.
                  Always check specific products for accurate nutritional data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {dietaryTypes.length > 0 || allergenFree.length > 0 || healthOptions.length > 0 ? (
              <span>
                {dietaryTypes.length + allergenFree.length + healthOptions.length} preference{dietaryTypes.length + allergenFree.length + healthOptions.length !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span>No preferences set</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </>
  )
}
