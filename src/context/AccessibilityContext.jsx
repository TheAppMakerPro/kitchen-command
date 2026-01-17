import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const AccessibilityContext = createContext(null)

const STORAGE_KEY = 'recipe-app-accessibility'

const defaultSettings = {
  highContrast: false,
  fontSize: 'normal', // 'small', 'normal', 'large', 'xl'
  reduceMotion: false,
  colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) })
      }

      // Check system preference for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setSettings(prev => ({ ...prev, reduceMotion: true }))
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error)
    }
  }, [])

  // Save settings to localStorage and apply to document
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

      const root = document.documentElement

      // High contrast
      root.classList.toggle('high-contrast', settings.highContrast)

      // Font size
      root.classList.remove('font-small', 'font-normal', 'font-large', 'font-xl')
      root.classList.add(`font-${settings.fontSize}`)

      // Reduced motion
      root.classList.toggle('reduce-motion', settings.reduceMotion)

      // Color blind modes
      root.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia')
      if (settings.colorBlindMode !== 'none') {
        root.classList.add(`cb-${settings.colorBlindMode}`)
      }
    } catch (error) {
      console.error('Error saving accessibility settings:', error)
    }
  }, [settings])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e) => {
      if (e.matches) {
        setSettings(prev => ({ ...prev, reduceMotion: true }))
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }, [])

  const toggleReduceMotion = useCallback(() => {
    setSettings(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }))
  }, [])

  const setFontSize = useCallback((size) => {
    setSettings(prev => ({ ...prev, fontSize: size }))
  }, [])

  const setColorBlindMode = useCallback((mode) => {
    setSettings(prev => ({ ...prev, colorBlindMode: mode }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  const value = {
    ...settings,
    updateSetting,
    toggleHighContrast,
    toggleReduceMotion,
    setFontSize,
    setColorBlindMode,
    resetSettings,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
