import { useCallback, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useOffline, OFFLINE_ACTIONS } from '../context/OfflineContext'

/**
 * Hook that wraps app actions with offline support.
 * When online, actions execute immediately.
 * When offline, actions are queued and synced when back online.
 * Favorites are automatically cached for offline viewing.
 */
export function useOfflineActions() {
  const app = useApp()
  const offline = useOffline()

  const {
    addFavorite: appAddFavorite,
    removeFavorite: appRemoveFavorite,
    markAsCooked: appMarkAsCooked,
    addToMealPlan: appAddToMealPlan,
    removeFromMealPlan: appRemoveFromMealPlan,
    favorites,
  } = app

  const {
    isOnline,
    cacheRecipe,
    cacheRecipes,
    uncacheRecipe,
    queueAction,
  } = offline

  // Cache all favorites on mount and when favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      cacheRecipes(favorites)
    }
  }, [favorites, cacheRecipes])

  // Listen for sync events from OfflineContext
  useEffect(() => {
    const handleSyncAction = (event) => {
      const { type, payload } = event.detail

      switch (type) {
        case OFFLINE_ACTIONS.ADD_FAVORITE:
          appAddFavorite(payload.meal)
          break
        case OFFLINE_ACTIONS.REMOVE_FAVORITE:
          appRemoveFavorite(payload.mealId)
          break
        case OFFLINE_ACTIONS.MARK_AS_COOKED:
          appMarkAsCooked(payload.mealId)
          break
        case OFFLINE_ACTIONS.ADD_TO_MEAL_PLAN:
          appAddToMealPlan(payload.day, payload.slot, payload.meal)
          break
        case OFFLINE_ACTIONS.REMOVE_FROM_MEAL_PLAN:
          appRemoveFromMealPlan(payload.day, payload.slot, payload.mealId)
          break
        default:
          console.warn('Unknown sync action:', type)
      }
    }

    window.addEventListener('offline-sync-action', handleSyncAction)
    return () => window.removeEventListener('offline-sync-action', handleSyncAction)
  }, [appAddFavorite, appRemoveFavorite, appMarkAsCooked, appAddToMealPlan, appRemoveFromMealPlan])

  // Wrapped addFavorite with offline support
  const addFavorite = useCallback((meal) => {
    // Always cache the recipe for offline access
    cacheRecipe(meal)

    if (isOnline) {
      appAddFavorite(meal)
    } else {
      // Queue for later sync, but still update local state
      queueAction(OFFLINE_ACTIONS.ADD_FAVORITE, { meal })
      appAddFavorite(meal) // Optimistic update
    }
  }, [isOnline, appAddFavorite, cacheRecipe, queueAction])

  // Wrapped removeFavorite with offline support
  const removeFavorite = useCallback((mealId) => {
    if (isOnline) {
      appRemoveFavorite(mealId)
      // Keep in cache for a while in case user wants to re-add
    } else {
      queueAction(OFFLINE_ACTIONS.REMOVE_FAVORITE, { mealId })
      appRemoveFavorite(mealId) // Optimistic update
    }
  }, [isOnline, appRemoveFavorite, queueAction])

  // Wrapped markAsCooked with offline support
  const markAsCooked = useCallback((mealId) => {
    if (isOnline) {
      appMarkAsCooked(mealId)
    } else {
      queueAction(OFFLINE_ACTIONS.MARK_AS_COOKED, { mealId })
      appMarkAsCooked(mealId) // Optimistic update
    }
  }, [isOnline, appMarkAsCooked, queueAction])

  // Wrapped addToMealPlan with offline support
  const addToMealPlan = useCallback((day, slot, meal) => {
    // Cache the meal for offline viewing in meal plan
    cacheRecipe(meal)

    if (isOnline) {
      appAddToMealPlan(day, slot, meal)
    } else {
      queueAction(OFFLINE_ACTIONS.ADD_TO_MEAL_PLAN, { day, slot, meal })
      appAddToMealPlan(day, slot, meal) // Optimistic update
    }
  }, [isOnline, appAddToMealPlan, cacheRecipe, queueAction])

  // Wrapped removeFromMealPlan with offline support
  const removeFromMealPlan = useCallback((day, slot, mealId) => {
    if (isOnline) {
      appRemoveFromMealPlan(day, slot, mealId)
    } else {
      queueAction(OFFLINE_ACTIONS.REMOVE_FROM_MEAL_PLAN, { day, slot, mealId })
      appRemoveFromMealPlan(day, slot, mealId) // Optimistic update
    }
  }, [isOnline, appRemoveFromMealPlan, queueAction])

  return {
    ...app,
    // Override with offline-aware versions
    addFavorite,
    removeFavorite,
    markAsCooked,
    addToMealPlan,
    removeFromMealPlan,
    // Expose offline state
    isOnline,
  }
}
