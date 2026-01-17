import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const navItems = [
  { path: '/home', label: 'Home', icon: '🏠', color: 'from-amber-400 to-orange-500' },
  { path: '/search', label: 'Search', icon: '🔍', color: 'from-blue-400 to-indigo-500' },
  { path: '/fridge', label: 'My Fridge', icon: '🧊', color: 'from-cyan-400 to-teal-500' },
  { path: '/collections', label: 'Collections', icon: '📚', color: 'from-purple-400 to-indigo-500' },
  { path: '/favorites', label: 'Favorites', icon: '❤️', color: 'from-rose-400 to-pink-500' },
  { path: '/meal-planner', label: 'Meal Planner', icon: '📅', color: 'from-violet-400 to-purple-500' },
  { path: '/shopping-list', label: 'Shopping List', icon: '🛒', color: 'from-emerald-400 to-teal-500' },
]

const learnItems = [
  { path: '/techniques', label: 'Techniques', icon: '🔪', color: 'from-slate-400 to-gray-500' },
  { path: '/ingredients', label: 'Ingredients', icon: '🧄', color: 'from-lime-400 to-green-500' },
  { path: '/seasonal', label: 'Seasonal', icon: '🍂', color: 'from-orange-400 to-amber-500' },
  { path: '/calculator', label: 'Calculator', icon: '🧮', color: 'from-indigo-400 to-blue-500' },
  { path: '/meal-prep', label: 'Meal Prep', icon: '📦', color: 'from-teal-400 to-cyan-500' },
]

export default function MobileNav({ isOpen, onClose }) {
  const location = useLocation()
  const { favorites, shoppingList } = useApp()
  const closeButtonRef = useRef(null)

  // Handle Escape key to close menu
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

  // Focus management and body scroll lock
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-y-0 left-0 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 md:hidden transform transition-transform duration-300 shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg">
              <span className="text-xl">🍽️</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">Menu</span>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4.5rem)]" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const badge =
              item.path === '/favorites' && favorites.length > 0
                ? favorites.length
                : item.path === '/shopping-list' && shoppingList.length > 0
                ? shoppingList.filter((i) => !i.checked).length
                : null

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${
                    isActive
                      ? 'bg-white/20'
                      : `bg-gradient-to-br ${item.color} shadow-sm`
                  } transition-transform group-hover:scale-110`}>
                    <span className="text-lg">{item.icon}</span>
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {badge && (
                  <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  }`}>
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Learn Section */}
          <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Learn
            </p>
            {learnItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                      isActive
                        ? 'bg-white/20'
                        : `bg-gradient-to-br ${item.color} shadow-sm`
                    } transition-transform group-hover:scale-110`}>
                      <span className="text-base">{item.icon}</span>
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
