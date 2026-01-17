import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

const fontSizeOptions = [
  { value: 'small', label: 'Small', sample: 'Aa' },
  { value: 'normal', label: 'Normal', sample: 'Aa' },
  { value: 'large', label: 'Large', sample: 'Aa' },
  { value: 'xl', label: 'Extra Large', sample: 'Aa' },
]

const colorBlindOptions = [
  { value: 'none', label: 'None', description: 'Default colors' },
  { value: 'protanopia', label: 'Protanopia', description: 'Red-blind friendly' },
  { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind friendly' },
  { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind friendly' },
]

export default function AccessibilitySettings({ isOpen, onClose }) {
  const {
    highContrast,
    fontSize,
    reduceMotion,
    colorBlindMode,
    toggleHighContrast,
    toggleReduceMotion,
    setFontSize,
    setColorBlindMode,
    resetSettings,
  } = useAccessibility()

  const [activeTab, setActiveTab] = useState('display')
  const modalRef = useRef(null)
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

  // Focus trap and initial focus
  useEffect(() => {
    if (!isOpen) return

    // Focus the close button when modal opens
    const timeoutId = setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 100)

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timeoutId)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

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
        aria-labelledby="accessibility-title"
        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 id="accessibility-title" className="text-xl font-bold text-gray-900 dark:text-white">
              Accessibility Settings
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close accessibility settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Accessibility settings tabs">
          <button
            role="tab"
            aria-selected={activeTab === 'display'}
            aria-controls="display-panel"
            id="display-tab"
            onClick={() => setActiveTab('display')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'display'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Display
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'motion'}
            aria-controls="motion-panel"
            id="motion-tab"
            onClick={() => setActiveTab('motion')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'motion'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Motion
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'vision'}
            aria-controls="vision-panel"
            id="vision-tab"
            onClick={() => setActiveTab('vision')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'vision'
                ? 'text-primary-600 border-b-2 border-primary-500 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Vision
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Display Tab */}
          {activeTab === 'display' && (
            <div
              role="tabpanel"
              id="display-panel"
              aria-labelledby="display-tab"
              className="space-y-6"
            >
              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Text Size
                </label>
                <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Text size options">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      role="radio"
                      aria-checked={fontSize === option.value}
                      onClick={() => setFontSize(option.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        fontSize === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span
                        className={`font-bold text-gray-900 dark:text-white ${
                          option.value === 'small' ? 'text-sm' :
                          option.value === 'normal' ? 'text-base' :
                          option.value === 'large' ? 'text-lg' : 'text-xl'
                        }`}
                      >
                        {option.sample}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">High Contrast Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Increase contrast for better visibility
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={highContrast}
                  onClick={toggleHighContrast}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    highContrast ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label="Toggle high contrast mode"
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      highContrast ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Motion Tab */}
          {activeTab === 'motion' && (
            <div
              role="tabpanel"
              id="motion-panel"
              aria-labelledby="motion-tab"
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Reduce Motion</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Minimize animations and transitions
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={reduceMotion}
                  onClick={toggleReduceMotion}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    reduceMotion ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label="Toggle reduce motion"
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      reduceMotion ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Note:</span> This setting will disable hover effects,
                  loading animations, and page transitions. It automatically respects your system's
                  "prefers-reduced-motion" preference.
                </p>
              </div>
            </div>
          )}

          {/* Vision Tab */}
          {activeTab === 'vision' && (
            <div
              role="tabpanel"
              id="vision-panel"
              aria-labelledby="vision-tab"
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Color Blind Mode
                </label>
                <div className="space-y-2" role="radiogroup" aria-label="Color blind mode options">
                  {colorBlindOptions.map((option) => (
                    <button
                      key={option.value}
                      role="radio"
                      aria-checked={colorBlindMode === option.value}
                      onClick={() => setColorBlindMode(option.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                        colorBlindMode === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                      </div>
                      {colorBlindMode === option.value && (
                        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <span className="font-semibold">Tip:</span> Color blind modes adjust the color palette
                  to improve distinction between colors that may appear similar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Reset all accessibility settings to defaults"
          >
            Reset to Defaults
          </button>
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
