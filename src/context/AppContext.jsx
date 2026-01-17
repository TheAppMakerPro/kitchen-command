import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { appReducer, initialState, actionTypes, MEAL_SLOTS, DAYS, getDateKey, getWeekStart, getWeekDates, addDays, createEmptyDay } from './appReducer'

export { MEAL_SLOTS, DAYS, getDateKey, getWeekStart, getWeekDates, addDays, createEmptyDay }

const AppContext = createContext(null)

const STORAGE_KEYS = {
  favorites: 'recipe-app-favorites',
  recentlyViewed: 'recipe-app-recently-viewed',
  cookedRecipes: 'recipe-app-cooked-recipes',
  recipeNotes: 'recipe-app-recipe-notes',
  mealPlan: 'recipe-app-meal-plan',
  calendarMeals: 'recipe-app-calendar-meals',
  shoppingList: 'recipe-app-shopping-list',
  customCollections: 'recipe-app-collections',
  darkMode: 'recipe-app-dark-mode',
  dietaryPreferences: 'recipe-app-dietary-preferences',
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEYS.favorites)
      if (savedFavorites) {
        dispatch({ type: actionTypes.SET_FAVORITES, payload: JSON.parse(savedFavorites) })
      }

      const savedRecentlyViewed = localStorage.getItem(STORAGE_KEYS.recentlyViewed)
      if (savedRecentlyViewed) {
        dispatch({ type: actionTypes.SET_RECENTLY_VIEWED, payload: JSON.parse(savedRecentlyViewed) })
      }

      const savedCookedRecipes = localStorage.getItem(STORAGE_KEYS.cookedRecipes)
      if (savedCookedRecipes) {
        dispatch({ type: actionTypes.SET_COOKED_RECIPES, payload: JSON.parse(savedCookedRecipes) })
      }

      const savedRecipeNotes = localStorage.getItem(STORAGE_KEYS.recipeNotes)
      if (savedRecipeNotes) {
        dispatch({ type: actionTypes.SET_ALL_RECIPE_NOTES, payload: JSON.parse(savedRecipeNotes) })
      }

      const savedMealPlan = localStorage.getItem(STORAGE_KEYS.mealPlan)
      if (savedMealPlan) {
        dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: JSON.parse(savedMealPlan) })
      }

      const savedCalendarMeals = localStorage.getItem(STORAGE_KEYS.calendarMeals)
      if (savedCalendarMeals) {
        dispatch({ type: actionTypes.SET_CALENDAR_MEALS, payload: JSON.parse(savedCalendarMeals) })
      }

      const savedShoppingList = localStorage.getItem(STORAGE_KEYS.shoppingList)
      if (savedShoppingList) {
        dispatch({ type: actionTypes.SET_SHOPPING_LIST, payload: JSON.parse(savedShoppingList) })
      }

      const savedCollections = localStorage.getItem(STORAGE_KEYS.customCollections)
      if (savedCollections) {
        dispatch({ type: actionTypes.SET_COLLECTIONS, payload: JSON.parse(savedCollections) })
      }

      const savedDarkMode = localStorage.getItem(STORAGE_KEYS.darkMode)
      if (savedDarkMode !== null) {
        dispatch({ type: actionTypes.SET_DARK_MODE, payload: JSON.parse(savedDarkMode) })
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        dispatch({ type: actionTypes.SET_DARK_MODE, payload: true })
      }

      const savedDietaryPreferences = localStorage.getItem(STORAGE_KEYS.dietaryPreferences)
      if (savedDietaryPreferences) {
        dispatch({ type: actionTypes.SET_DIETARY_PREFERENCES, payload: JSON.parse(savedDietaryPreferences) })
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  }, [state.favorites])

  // Save recently viewed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(state.recentlyViewed))
    } catch (error) {
      console.error('Error saving recently viewed:', error)
    }
  }, [state.recentlyViewed])

  // Save cooked recipes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cookedRecipes, JSON.stringify(state.cookedRecipes))
    } catch (error) {
      console.error('Error saving cooked recipes:', error)
    }
  }, [state.cookedRecipes])

  // Save recipe notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recipeNotes, JSON.stringify(state.recipeNotes))
    } catch (error) {
      console.error('Error saving recipe notes:', error)
    }
  }, [state.recipeNotes])

  // Save meal plan to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.mealPlan, JSON.stringify(state.mealPlan))
    } catch (error) {
      console.error('Error saving meal plan:', error)
    }
  }, [state.mealPlan])

  // Save calendar meals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.calendarMeals, JSON.stringify(state.calendarMeals))
    } catch (error) {
      console.error('Error saving calendar meals:', error)
    }
  }, [state.calendarMeals])

  // Save shopping list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.shoppingList, JSON.stringify(state.shoppingList))
    } catch (error) {
      console.error('Error saving shopping list:', error)
    }
  }, [state.shoppingList])

  // Save collections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customCollections, JSON.stringify(state.customCollections))
    } catch (error) {
      console.error('Error saving collections:', error)
    }
  }, [state.customCollections])

  // Save dark mode to localStorage and apply class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(state.darkMode))
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.error('Error saving dark mode:', error)
    }
  }, [state.darkMode])

  // Save dietary preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.dietaryPreferences, JSON.stringify(state.dietaryPreferences))
    } catch (error) {
      console.error('Error saving dietary preferences:', error)
    }
  }, [state.dietaryPreferences])

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: actionTypes.HIDE_TOAST })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state.toast])

  // Action creators
  const addFavorite = useCallback((meal) => {
    dispatch({ type: actionTypes.ADD_FAVORITE, payload: meal })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Added to favorites!', type: 'success' } })
  }, [])

  const removeFavorite = useCallback((mealId) => {
    dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: mealId })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Removed from favorites', type: 'info' } })
  }, [])

  const isFavorite = useCallback((mealId) => {
    return state.favorites.some(f => f.idMeal === mealId)
  }, [state.favorites])

  const addRecentlyViewed = useCallback((meal) => {
    dispatch({ type: actionTypes.ADD_RECENTLY_VIEWED, payload: meal })
  }, [])

  const markAsCooked = useCallback((mealId) => {
    dispatch({ type: actionTypes.MARK_AS_COOKED, payload: mealId })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Marked as cooked!', type: 'success' } })
  }, [])

  const getCookedCount = useCallback((mealId) => {
    return state.cookedRecipes[mealId]?.count || 0
  }, [state.cookedRecipes])

  const setRecipeNote = useCallback((mealId, note) => {
    dispatch({ type: actionTypes.SET_RECIPE_NOTE, payload: { mealId, note } })
  }, [])

  const getRecipeNote = useCallback((mealId) => {
    return state.recipeNotes[mealId] || ''
  }, [state.recipeNotes])

  const addToMealPlan = useCallback((day, slot, meal) => {
    dispatch({ type: actionTypes.ADD_TO_MEAL_PLAN, payload: { day, slot, meal } })
    const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1)
    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1)
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: `Added to ${dayLabel} ${slotLabel}!`, type: 'success' } })
  }, [])

  const removeFromMealPlan = useCallback((day, slot, mealId) => {
    dispatch({ type: actionTypes.REMOVE_FROM_MEAL_PLAN, payload: { day, slot, mealId } })
  }, [])

  const moveMeal = useCallback((fromDay, fromSlot, toDay, toSlot, meal, fromIndex) => {
    dispatch({ type: actionTypes.MOVE_MEAL, payload: { fromDay, fromSlot, toDay, toSlot, meal, fromIndex } })
  }, [])

  const clearSlot = useCallback((day, slot) => {
    dispatch({ type: actionTypes.CLEAR_SLOT, payload: { day, slot } })
  }, [])

  const clearDay = useCallback((day) => {
    dispatch({ type: actionTypes.CLEAR_DAY, payload: day })
  }, [])

  const clearMealPlan = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_MEAL_PLAN })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Meal plan cleared', type: 'info' } })
  }, [])

  // Calendar actions
  const addToCalendar = useCallback((dateKey, slot, meal) => {
    dispatch({ type: actionTypes.ADD_TO_CALENDAR, payload: { dateKey, slot, meal } })
    const date = new Date(dateKey)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1)
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: `Added to ${dayName} ${slotLabel}!`, type: 'success' } })
  }, [])

  const removeFromCalendar = useCallback((dateKey, slot, mealId) => {
    dispatch({ type: actionTypes.REMOVE_FROM_CALENDAR, payload: { dateKey, slot, mealId } })
  }, [])

  const moveCalendarMeal = useCallback((fromDate, fromSlot, toDate, toSlot, meal, fromIndex) => {
    dispatch({ type: actionTypes.MOVE_CALENDAR_MEAL, payload: { fromDate, fromSlot, toDate, toSlot, meal, fromIndex } })
  }, [])

  const clearCalendarDay = useCallback((dateKey) => {
    dispatch({ type: actionTypes.CLEAR_CALENDAR_DAY, payload: dateKey })
  }, [])

  const copyWeek = useCallback((sourceStartDate, targetStartDate) => {
    dispatch({ type: actionTypes.COPY_WEEK, payload: { sourceStartDate, targetStartDate } })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Week copied successfully!', type: 'success' } })
  }, [])

  const repeatWeek = useCallback((sourceStartDate, numberOfWeeks) => {
    dispatch({ type: actionTypes.REPEAT_WEEK, payload: { sourceStartDate, numberOfWeeks } })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: `Meal plan repeated for ${numberOfWeeks} week${numberOfWeeks > 1 ? 's' : ''}!`, type: 'success' } })
  }, [])

  const addShoppingItem = useCallback((item) => {
    dispatch({ type: actionTypes.ADD_SHOPPING_ITEM, payload: item })
  }, [])

  const removeShoppingItem = useCallback((itemId) => {
    dispatch({ type: actionTypes.REMOVE_SHOPPING_ITEM, payload: itemId })
  }, [])

  const toggleShoppingItem = useCallback((itemId) => {
    dispatch({ type: actionTypes.TOGGLE_SHOPPING_ITEM, payload: itemId })
  }, [])

  const clearShoppingList = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_SHOPPING_LIST })
  }, [])

  const clearCompletedItems = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_COMPLETED_ITEMS })
  }, [])

  const generateShoppingList = useCallback((ingredients) => {
    dispatch({ type: actionTypes.GENERATE_SHOPPING_LIST, payload: ingredients })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Shopping list generated!', type: 'success' } })
  }, [])

  const addIngredientsToShoppingList = useCallback((ingredients, recipeName) => {
    dispatch({ type: actionTypes.ADD_RECIPE_INGREDIENTS, payload: { ingredients, recipeName } })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: `Added ${ingredients.length} ingredients to shopping list!`, type: 'success' } })
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message, type } })
  }, [])

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE })
  }, [])

  // Collection actions
  const createCollection = useCallback((collection) => {
    dispatch({ type: actionTypes.CREATE_COLLECTION, payload: collection })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: `Collection "${collection.name}" created!`, type: 'success' } })
  }, [])

  const updateCollection = useCallback((id, updates) => {
    dispatch({ type: actionTypes.UPDATE_COLLECTION, payload: { id, ...updates } })
  }, [])

  const deleteCollection = useCallback((id) => {
    dispatch({ type: actionTypes.DELETE_COLLECTION, payload: id })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Collection deleted', type: 'info' } })
  }, [])

  const addToCollection = useCallback((collectionId, recipeId) => {
    dispatch({ type: actionTypes.ADD_TO_COLLECTION, payload: { collectionId, recipeId } })
    dispatch({ type: actionTypes.SHOW_TOAST, payload: { message: 'Added to collection!', type: 'success' } })
  }, [])

  const removeFromCollection = useCallback((collectionId, recipeId) => {
    dispatch({ type: actionTypes.REMOVE_FROM_COLLECTION, payload: { collectionId, recipeId } })
  }, [])

  const isInCollection = useCallback((collectionId, recipeId) => {
    const collection = state.customCollections.find(c => c.id === collectionId)
    return collection ? collection.recipeIds.includes(recipeId) : false
  }, [state.customCollections])

  // Dietary preference actions
  const toggleDietaryType = useCallback((typeId) => {
    dispatch({ type: actionTypes.TOGGLE_DIETARY_TYPE, payload: typeId })
  }, [])

  const toggleAllergenFree = useCallback((allergenId) => {
    dispatch({ type: actionTypes.TOGGLE_ALLERGEN_FREE, payload: allergenId })
  }, [])

  const toggleHealthOption = useCallback((optionId) => {
    dispatch({ type: actionTypes.TOGGLE_HEALTH_OPTION, payload: optionId })
  }, [])

  const updateDietaryPreference = useCallback((key, value) => {
    dispatch({ type: actionTypes.UPDATE_DIETARY_PREFERENCE, payload: { key, value } })
  }, [])

  const value = {
    ...state,
    addFavorite,
    removeFavorite,
    isFavorite,
    addRecentlyViewed,
    markAsCooked,
    getCookedCount,
    setRecipeNote,
    getRecipeNote,
    addToMealPlan,
    removeFromMealPlan,
    moveMeal,
    clearSlot,
    clearDay,
    clearMealPlan,
    addToCalendar,
    removeFromCalendar,
    moveCalendarMeal,
    clearCalendarDay,
    copyWeek,
    repeatWeek,
    addShoppingItem,
    removeShoppingItem,
    toggleShoppingItem,
    clearShoppingList,
    clearCompletedItems,
    generateShoppingList,
    addIngredientsToShoppingList,
    showToast,
    toggleDarkMode,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    toggleDietaryType,
    toggleAllergenFree,
    toggleHealthOption,
    updateDietaryPreference,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
