import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext'

// Layout
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import MobileNav from './components/Layout/MobileNav'
import AccessibilitySettings from './components/AccessibilitySettings'
import DietaryPreferences from './components/DietaryPreferences'
import OfflineIndicator from './components/ui/OfflineIndicator'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Pages
import Home from './pages/Home'
import Search from './pages/Search'
import RecipePage from './pages/RecipePage'
import Favorites from './pages/Favorites'
import Fridge from './pages/Fridge'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import MealPlannerPage from './pages/MealPlannerPage'
import ShoppingListPage from './pages/ShoppingListPage'
import TechniqueLibrary from './pages/TechniqueLibrary'
import IngredientGlossary from './pages/IngredientGlossary'
import SeasonalGuides from './pages/SeasonalGuides'
import KitchenCalculator from './pages/KitchenCalculator'
import MealPrepGuides from './pages/MealPrepGuides'

// Toast Component
function Toast({ toast }) {
  if (!toast) return null

  const config = {
    success: {
      bg: 'from-emerald-500 to-teal-600',
      ariaLive: 'polite',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'from-rose-500 to-pink-600',
      ariaLive: 'assertive',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: 'from-blue-500 to-indigo-600',
      ariaLive: 'polite',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }

  const { bg, icon, ariaLive } = config[toast.type] || config.info

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 animate-slide-up"
      role="alert"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${bg} text-white rounded-2xl shadow-2xl backdrop-blur-sm max-w-md mx-auto sm:mx-0`}>
        <span className="flex-shrink-0 p-1 bg-white/20 rounded-lg" aria-hidden="true">
          {icon}
        </span>
        <span className="font-medium text-sm sm:text-base">{toast.message}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [dietaryOpen, setDietaryOpen] = useState(false)
  const { toast } = useApp()

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* SVG Filters for Color Blind Modes */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Protanopia (red-blind) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>
          {/* Deuteranopia (green-blind) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0,   0, 0
                      0.7,   0.3,   0,   0, 0
                      0,     0.3,   0.7, 0, 0
                      0,     0,     0,   1, 0"
            />
          </filter>
          {/* Tritanopia (blue-blind) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="skip-link focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      <Header
        onMenuToggle={() => setMobileMenuOpen(true)}
        onAccessibilityToggle={() => setAccessibilityOpen(true)}
        onDietaryToggle={() => setDietaryOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
      />
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <AccessibilitySettings isOpen={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
      <DietaryPreferences isOpen={dietaryOpen} onClose={() => setDietaryOpen(false)} />

      <div className="flex">
        <Sidebar />
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full" role="main">
          <ErrorBoundary
            title="Something went wrong"
            message="An unexpected error occurred while loading this page."
            onRetry={() => window.location.reload()}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/fridge" element={<Fridge />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:collectionId" element={<CollectionDetail />} />
              <Route path="/collections/custom/:customId" element={<CollectionDetail />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/techniques" element={<TechniqueLibrary />} />
              <Route path="/ingredients" element={<IngredientGlossary />} />
              <Route path="/seasonal" element={<SeasonalGuides />} />
              <Route path="/calculator" element={<KitchenCalculator />} />
              <Route path="/meal-prep" element={<MealPrepGuides />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      <Toast toast={toast} />
      <OfflineIndicator />
    </div>
  )
}
