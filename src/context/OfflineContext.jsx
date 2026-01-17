import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const OfflineContext = createContext(null)

const STORAGE_KEYS = {
  actionQueue: 'recipe-app-action-queue',
  cachedRecipes: 'recipe-app-cached-recipes',
}

// Action types that can be queued
export const OFFLINE_ACTIONS = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  MARK_AS_COOKED: 'MARK_AS_COOKED',
  ADD_TO_MEAL_PLAN: 'ADD_TO_MEAL_PLAN',
  REMOVE_FROM_MEAL_PLAN: 'REMOVE_FROM_MEAL_PLAN',
  ADD_SHOPPING_ITEM: 'ADD_SHOPPING_ITEM',
  TOGGLE_SHOPPING_ITEM: 'TOGGLE_SHOPPING_ITEM',
}

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)
  const [actionQueue, setActionQueue] = useState([])
  const [cachedRecipeIds, setCachedRecipeIds] = useState(new Set())
  const [isSyncing, setIsSyncing] = useState(false)
  const swRegistration = useRef(null)

  // Load cached data on mount
  useEffect(() => {
    try {
      const savedQueue = localStorage.getItem(STORAGE_KEYS.actionQueue)
      if (savedQueue) {
        setActionQueue(JSON.parse(savedQueue))
      }

      const savedCached = localStorage.getItem(STORAGE_KEYS.cachedRecipes)
      if (savedCached) {
        setCachedRecipeIds(new Set(JSON.parse(savedCached)))
      }
    } catch (error) {
      console.error('Error loading offline data:', error)
    }
  }, [])

  // Save action queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.actionQueue, JSON.stringify(actionQueue))
    } catch (error) {
      console.error('Error saving action queue:', error)
    }
  }, [actionQueue])

  // Save cached recipe IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cachedRecipes, JSON.stringify([...cachedRecipeIds]))
    } catch (error) {
      console.error('Error saving cached recipes:', error)
    }
  }, [cachedRecipeIds])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          swRegistration.current = registration
          setIsServiceWorkerReady(true)
          console.log('Service Worker registered')
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Trigger sync when coming back online
      syncQueuedActions()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cache a recipe for offline use
  const cacheRecipe = useCallback((recipe) => {
    if (!recipe || !recipe.idMeal) return

    // Send to service worker
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'CACHE_RECIPE',
        recipe
      })
    }

    // Track cached recipe ID
    setCachedRecipeIds(prev => new Set([...prev, recipe.idMeal]))
  }, [])

  // Cache multiple recipes
  const cacheRecipes = useCallback((recipes) => {
    if (!recipes || recipes.length === 0) return

    // Send to service worker
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'CACHE_RECIPES',
        recipes
      })
    }

    // Track cached recipe IDs
    setCachedRecipeIds(prev => new Set([...prev, ...recipes.map(r => r.idMeal)]))
  }, [])

  // Remove a recipe from cache
  const uncacheRecipe = useCallback((recipeId) => {
    // Send to service worker
    if (swRegistration.current?.active) {
      swRegistration.current.active.postMessage({
        type: 'REMOVE_CACHED_RECIPE',
        recipeId
      })
    }

    // Remove from tracked IDs
    setCachedRecipeIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(recipeId)
      return newSet
    })
  }, [])

  // Check if a recipe is cached
  const isRecipeCached = useCallback((recipeId) => {
    return cachedRecipeIds.has(recipeId)
  }, [cachedRecipeIds])

  // Add an action to the queue (for when offline)
  const queueAction = useCallback((actionType, payload) => {
    const action = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: actionType,
      payload,
      timestamp: new Date().toISOString(),
    }

    setActionQueue(prev => [...prev, action])
    return action.id
  }, [])

  // Remove an action from the queue
  const removeFromQueue = useCallback((actionId) => {
    setActionQueue(prev => prev.filter(action => action.id !== actionId))
  }, [])

  // Sync queued actions when back online
  const syncQueuedActions = useCallback(async () => {
    if (!isOnline || actionQueue.length === 0 || isSyncing) return

    setIsSyncing(true)

    try {
      // Process actions in order
      for (const action of actionQueue) {
        try {
          // Dispatch a custom event for each action type
          // The AppContext will listen for these and process them
          window.dispatchEvent(new CustomEvent('offline-sync-action', {
            detail: action
          }))

          // Remove from queue after successful processing
          removeFromQueue(action.id)
        } catch (error) {
          console.error('Error syncing action:', action, error)
        }
      }
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, actionQueue, isSyncing, removeFromQueue])

  // Clear all queued actions
  const clearQueue = useCallback(() => {
    setActionQueue([])
  }, [])

  // Get pending action count
  const pendingActionsCount = actionQueue.length

  const value = {
    isOnline,
    isServiceWorkerReady,
    isSyncing,
    actionQueue,
    pendingActionsCount,
    cachedRecipeIds: [...cachedRecipeIds],
    cacheRecipe,
    cacheRecipes,
    uncacheRecipe,
    isRecipeCached,
    queueAction,
    removeFromQueue,
    syncQueuedActions,
    clearQueue,
  }

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}
