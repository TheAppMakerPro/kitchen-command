// Meal slots configuration
export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks', 'dessert']
export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// Create empty day structure
export const createEmptyDay = () => ({
  breakfast: null,
  lunch: null,
  dinner: null,
  snacks: [], // Snacks can have multiple items
  dessert: null,
})

// Create empty meal plan (for current week view - legacy support)
const createEmptyMealPlan = () => ({
  monday: createEmptyDay(),
  tuesday: createEmptyDay(),
  wednesday: createEmptyDay(),
  thursday: createEmptyDay(),
  friday: createEmptyDay(),
  saturday: createEmptyDay(),
  sunday: createEmptyDay(),
})

// Date utility functions
export const getDateKey = (date) => {
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD format
}

export const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
  return new Date(d.setDate(diff))
}

export const getWeekDates = (startDate) => {
  const dates = []
  const start = new Date(startDate)
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    dates.push(getDateKey(date))
  }
  return dates
}

export const addDays = (date, days) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const initialState = {
  favorites: [],
  recentlyViewed: [],
  cookedRecipes: {}, // { mealId: { count: number, lastCooked: timestamp } }
  recipeNotes: {}, // { mealId: string }
  mealPlan: createEmptyMealPlan(), // Legacy week view
  calendarMeals: {}, // { 'YYYY-MM-DD': { breakfast, lunch, dinner, snacks, dessert } }
  shoppingList: [],
  customCollections: [], // { id, name, description, icon, color, recipeIds: [] }
  toast: null,
  darkMode: false,
  // Dietary preferences
  dietaryPreferences: {
    dietaryTypes: [], // 'vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher'
    allergenFree: [], // 'gluten', 'dairy', 'eggs', 'nuts', 'peanuts', 'shellfish', 'fish', 'soy', 'sesame'
    healthOptions: [], // 'lowSodium', 'lowSugar'
    showAllergenWarnings: true,
  },
}

export const actionTypes = {
  // Favorites
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_FAVORITES: 'SET_FAVORITES',

  // Recently Viewed
  ADD_RECENTLY_VIEWED: 'ADD_RECENTLY_VIEWED',
  SET_RECENTLY_VIEWED: 'SET_RECENTLY_VIEWED',

  // Cooked Recipes
  MARK_AS_COOKED: 'MARK_AS_COOKED',
  SET_COOKED_RECIPES: 'SET_COOKED_RECIPES',

  // Recipe Notes
  SET_RECIPE_NOTE: 'SET_RECIPE_NOTE',
  SET_ALL_RECIPE_NOTES: 'SET_ALL_RECIPE_NOTES',

  // Meal Plan (Week View)
  ADD_TO_MEAL_PLAN: 'ADD_TO_MEAL_PLAN',
  REMOVE_FROM_MEAL_PLAN: 'REMOVE_FROM_MEAL_PLAN',
  MOVE_MEAL: 'MOVE_MEAL',
  CLEAR_SLOT: 'CLEAR_SLOT',
  CLEAR_DAY: 'CLEAR_DAY',
  CLEAR_MEAL_PLAN: 'CLEAR_MEAL_PLAN',
  SET_MEAL_PLAN: 'SET_MEAL_PLAN',

  // Calendar Meals (Date-based)
  ADD_TO_CALENDAR: 'ADD_TO_CALENDAR',
  REMOVE_FROM_CALENDAR: 'REMOVE_FROM_CALENDAR',
  MOVE_CALENDAR_MEAL: 'MOVE_CALENDAR_MEAL',
  CLEAR_CALENDAR_DAY: 'CLEAR_CALENDAR_DAY',
  COPY_WEEK: 'COPY_WEEK',
  REPEAT_WEEK: 'REPEAT_WEEK',
  SET_CALENDAR_MEALS: 'SET_CALENDAR_MEALS',

  // Shopping List
  ADD_SHOPPING_ITEM: 'ADD_SHOPPING_ITEM',
  REMOVE_SHOPPING_ITEM: 'REMOVE_SHOPPING_ITEM',
  TOGGLE_SHOPPING_ITEM: 'TOGGLE_SHOPPING_ITEM',
  CLEAR_SHOPPING_LIST: 'CLEAR_SHOPPING_LIST',
  CLEAR_COMPLETED_ITEMS: 'CLEAR_COMPLETED_ITEMS',
  SET_SHOPPING_LIST: 'SET_SHOPPING_LIST',
  GENERATE_SHOPPING_LIST: 'GENERATE_SHOPPING_LIST',
  ADD_RECIPE_INGREDIENTS: 'ADD_RECIPE_INGREDIENTS',

  // Toast
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',

  // Dark Mode
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_DARK_MODE: 'SET_DARK_MODE',

  // Collections
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  UPDATE_COLLECTION: 'UPDATE_COLLECTION',
  DELETE_COLLECTION: 'DELETE_COLLECTION',
  ADD_TO_COLLECTION: 'ADD_TO_COLLECTION',
  REMOVE_FROM_COLLECTION: 'REMOVE_FROM_COLLECTION',
  SET_COLLECTIONS: 'SET_COLLECTIONS',

  // Dietary Preferences
  SET_DIETARY_PREFERENCES: 'SET_DIETARY_PREFERENCES',
  UPDATE_DIETARY_PREFERENCE: 'UPDATE_DIETARY_PREFERENCE',
  TOGGLE_DIETARY_TYPE: 'TOGGLE_DIETARY_TYPE',
  TOGGLE_ALLERGEN_FREE: 'TOGGLE_ALLERGEN_FREE',
  TOGGLE_HEALTH_OPTION: 'TOGGLE_HEALTH_OPTION',
}

export function appReducer(state, action) {
  switch (action.type) {
    // Favorites
    case actionTypes.ADD_FAVORITE:
      if (state.favorites.some(f => f.idMeal === action.payload.idMeal)) {
        return state
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }

    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(f => f.idMeal !== action.payload),
      }

    case actionTypes.SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      }

    // Recently Viewed
    case actionTypes.ADD_RECENTLY_VIEWED: {
      const meal = action.payload
      // Remove if already exists (to move to front)
      const filtered = state.recentlyViewed.filter(m => m.idMeal !== meal.idMeal)
      // Add to front, keep max 10 items
      return {
        ...state,
        recentlyViewed: [meal, ...filtered].slice(0, 10),
      }
    }

    case actionTypes.SET_RECENTLY_VIEWED:
      return {
        ...state,
        recentlyViewed: action.payload,
      }

    // Cooked Recipes
    case actionTypes.MARK_AS_COOKED: {
      const mealId = action.payload
      const existing = state.cookedRecipes[mealId] || { count: 0 }
      return {
        ...state,
        cookedRecipes: {
          ...state.cookedRecipes,
          [mealId]: {
            count: existing.count + 1,
            lastCooked: Date.now(),
          },
        },
      }
    }

    case actionTypes.SET_COOKED_RECIPES:
      return {
        ...state,
        cookedRecipes: action.payload,
      }

    // Recipe Notes
    case actionTypes.SET_RECIPE_NOTE: {
      const { mealId, note } = action.payload
      if (!note || note.trim() === '') {
        // Remove note if empty
        const { [mealId]: removed, ...rest } = state.recipeNotes
        return { ...state, recipeNotes: rest }
      }
      return {
        ...state,
        recipeNotes: {
          ...state.recipeNotes,
          [mealId]: note,
        },
      }
    }

    case actionTypes.SET_ALL_RECIPE_NOTES:
      return {
        ...state,
        recipeNotes: action.payload,
      }

    // Meal Plan
    case actionTypes.ADD_TO_MEAL_PLAN: {
      const { day, slot, meal } = action.payload
      const dayData = state.mealPlan[day] || createEmptyDay()

      // Handle snacks slot (array)
      if (slot === 'snacks') {
        const snacks = dayData.snacks || []
        if (snacks.some(m => m.idMeal === meal.idMeal)) {
          return state
        }
        return {
          ...state,
          mealPlan: {
            ...state.mealPlan,
            [day]: {
              ...dayData,
              snacks: [...snacks, meal],
            },
          },
        }
      }

      // Handle single meal slots (breakfast, lunch, dinner, dessert)
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [day]: {
            ...dayData,
            [slot]: meal,
          },
        },
      }
    }

    case actionTypes.REMOVE_FROM_MEAL_PLAN: {
      const { day, slot, mealId } = action.payload
      const dayData = state.mealPlan[day]
      if (!dayData) return state

      // Handle snacks slot (array)
      if (slot === 'snacks') {
        return {
          ...state,
          mealPlan: {
            ...state.mealPlan,
            [day]: {
              ...dayData,
              snacks: dayData.snacks.filter(m => m.idMeal !== mealId),
            },
          },
        }
      }

      // Handle single meal slots
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [day]: {
            ...dayData,
            [slot]: null,
          },
        },
      }
    }

    case actionTypes.MOVE_MEAL: {
      const { fromDay, fromSlot, toDay, toSlot, meal, fromIndex } = action.payload
      let newMealPlan = { ...state.mealPlan }

      // Remove from source
      const fromDayData = { ...newMealPlan[fromDay] }
      if (fromSlot === 'snacks') {
        fromDayData.snacks = fromDayData.snacks.filter((_, idx) =>
          fromIndex !== undefined ? idx !== fromIndex : true
        )
      } else {
        fromDayData[fromSlot] = null
      }
      newMealPlan[fromDay] = fromDayData

      // Add to destination
      const toDayData = { ...newMealPlan[toDay] }
      if (toSlot === 'snacks') {
        toDayData.snacks = [...(toDayData.snacks || []), meal]
      } else {
        // If destination has a meal, swap it to source
        if (toDayData[toSlot]) {
          const existingMeal = toDayData[toSlot]
          if (fromSlot === 'snacks') {
            fromDayData.snacks = [...fromDayData.snacks, existingMeal]
          } else {
            fromDayData[fromSlot] = existingMeal
          }
          newMealPlan[fromDay] = fromDayData
        }
        toDayData[toSlot] = meal
      }
      newMealPlan[toDay] = toDayData

      return {
        ...state,
        mealPlan: newMealPlan,
      }
    }

    case actionTypes.CLEAR_SLOT: {
      const { day, slot } = action.payload
      const dayData = state.mealPlan[day]
      if (!dayData) return state

      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [day]: {
            ...dayData,
            [slot]: slot === 'snacks' ? [] : null,
          },
        },
      }
    }

    case actionTypes.CLEAR_DAY:
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.payload]: createEmptyDay(),
        },
      }

    case actionTypes.CLEAR_MEAL_PLAN:
      return {
        ...state,
        mealPlan: createEmptyMealPlan(),
      }

    case actionTypes.SET_MEAL_PLAN: {
      // Handle migration from old format to new format
      const newPlan = action.payload
      if (newPlan && typeof newPlan.monday === 'object' && !Array.isArray(newPlan.monday)) {
        // Already in new format
        return {
          ...state,
          mealPlan: newPlan,
        }
      }
      // Old format - migrate
      const migratedPlan = createEmptyMealPlan()
      if (newPlan) {
        DAYS.forEach(day => {
          if (Array.isArray(newPlan[day])) {
            // Distribute old meals to slots
            newPlan[day].forEach((meal, idx) => {
              if (idx === 0) migratedPlan[day].lunch = meal
              else if (idx === 1) migratedPlan[day].dinner = meal
              else migratedPlan[day].snacks.push(meal)
            })
          }
        })
      }
      return {
        ...state,
        mealPlan: migratedPlan,
      }
    }

    // Calendar Meals (Date-based)
    case actionTypes.ADD_TO_CALENDAR: {
      const { date, slot, meal } = action.payload
      const dateKey = getDateKey(date)
      const dayData = state.calendarMeals[dateKey] || createEmptyDay()

      if (slot === 'snacks') {
        const snacks = dayData.snacks || []
        if (snacks.some(m => m.idMeal === meal.idMeal)) {
          return state
        }
        return {
          ...state,
          calendarMeals: {
            ...state.calendarMeals,
            [dateKey]: {
              ...dayData,
              snacks: [...snacks, meal],
            },
          },
        }
      }

      return {
        ...state,
        calendarMeals: {
          ...state.calendarMeals,
          [dateKey]: {
            ...dayData,
            [slot]: meal,
          },
        },
      }
    }

    case actionTypes.REMOVE_FROM_CALENDAR: {
      const { date, slot, mealId } = action.payload
      const dateKey = getDateKey(date)
      const dayData = state.calendarMeals[dateKey]
      if (!dayData) return state

      if (slot === 'snacks') {
        return {
          ...state,
          calendarMeals: {
            ...state.calendarMeals,
            [dateKey]: {
              ...dayData,
              snacks: dayData.snacks.filter(m => m.idMeal !== mealId),
            },
          },
        }
      }

      return {
        ...state,
        calendarMeals: {
          ...state.calendarMeals,
          [dateKey]: {
            ...dayData,
            [slot]: null,
          },
        },
      }
    }

    case actionTypes.MOVE_CALENDAR_MEAL: {
      const { fromDate, fromSlot, toDate, toSlot, meal, fromIndex } = action.payload
      const fromKey = getDateKey(fromDate)
      const toKey = getDateKey(toDate)
      let newCalendarMeals = { ...state.calendarMeals }

      // Remove from source
      const fromDayData = { ...(newCalendarMeals[fromKey] || createEmptyDay()) }
      if (fromSlot === 'snacks') {
        fromDayData.snacks = (fromDayData.snacks || []).filter((_, idx) =>
          fromIndex !== undefined ? idx !== fromIndex : true
        )
      } else {
        fromDayData[fromSlot] = null
      }
      newCalendarMeals[fromKey] = fromDayData

      // Add to destination
      const toDayData = { ...(newCalendarMeals[toKey] || createEmptyDay()) }
      if (toSlot === 'snacks') {
        toDayData.snacks = [...(toDayData.snacks || []), meal]
      } else {
        if (toDayData[toSlot]) {
          const existingMeal = toDayData[toSlot]
          if (fromSlot === 'snacks') {
            fromDayData.snacks = [...(fromDayData.snacks || []), existingMeal]
          } else {
            fromDayData[fromSlot] = existingMeal
          }
          newCalendarMeals[fromKey] = fromDayData
        }
        toDayData[toSlot] = meal
      }
      newCalendarMeals[toKey] = toDayData

      return {
        ...state,
        calendarMeals: newCalendarMeals,
      }
    }

    case actionTypes.CLEAR_CALENDAR_DAY: {
      const dateKey = getDateKey(action.payload)
      const { [dateKey]: removed, ...rest } = state.calendarMeals
      return {
        ...state,
        calendarMeals: rest,
      }
    }

    case actionTypes.COPY_WEEK: {
      const { sourceWeekStart, targetWeekStart } = action.payload
      const sourceDates = getWeekDates(sourceWeekStart)
      const targetDates = getWeekDates(targetWeekStart)
      const newCalendarMeals = { ...state.calendarMeals }

      sourceDates.forEach((sourceDate, index) => {
        const targetDate = targetDates[index]
        const sourceData = state.calendarMeals[sourceDate]
        if (sourceData) {
          // Deep copy the day data
          newCalendarMeals[targetDate] = {
            breakfast: sourceData.breakfast,
            lunch: sourceData.lunch,
            dinner: sourceData.dinner,
            snacks: [...(sourceData.snacks || [])],
            dessert: sourceData.dessert,
          }
        }
      })

      return {
        ...state,
        calendarMeals: newCalendarMeals,
      }
    }

    case actionTypes.REPEAT_WEEK: {
      const { sourceWeekStart, repeatCount } = action.payload
      const sourceDates = getWeekDates(sourceWeekStart)
      const newCalendarMeals = { ...state.calendarMeals }

      for (let week = 1; week <= repeatCount; week++) {
        const targetStart = addDays(new Date(sourceWeekStart), week * 7)
        const targetDates = getWeekDates(targetStart)

        sourceDates.forEach((sourceDate, index) => {
          const targetDate = targetDates[index]
          const sourceData = state.calendarMeals[sourceDate]
          if (sourceData) {
            newCalendarMeals[targetDate] = {
              breakfast: sourceData.breakfast,
              lunch: sourceData.lunch,
              dinner: sourceData.dinner,
              snacks: [...(sourceData.snacks || [])],
              dessert: sourceData.dessert,
            }
          }
        })
      }

      return {
        ...state,
        calendarMeals: newCalendarMeals,
      }
    }

    case actionTypes.SET_CALENDAR_MEALS:
      return {
        ...state,
        calendarMeals: action.payload,
      }

    // Shopping List
    case actionTypes.ADD_SHOPPING_ITEM: {
      const newItem = {
        id: Date.now().toString(),
        name: action.payload.name,
        quantity: action.payload.quantity || '',
        checked: false,
        category: action.payload.category || 'Other',
      }
      return {
        ...state,
        shoppingList: [...state.shoppingList, newItem],
      }
    }

    case actionTypes.REMOVE_SHOPPING_ITEM:
      return {
        ...state,
        shoppingList: state.shoppingList.filter(item => item.id !== action.payload),
      }

    case actionTypes.TOGGLE_SHOPPING_ITEM:
      return {
        ...state,
        shoppingList: state.shoppingList.map(item =>
          item.id === action.payload ? { ...item, checked: !item.checked } : item
        ),
      }

    case actionTypes.CLEAR_SHOPPING_LIST:
      return {
        ...state,
        shoppingList: [],
      }

    case actionTypes.CLEAR_COMPLETED_ITEMS:
      return {
        ...state,
        shoppingList: state.shoppingList.filter(item => !item.checked),
      }

    case actionTypes.SET_SHOPPING_LIST:
      return {
        ...state,
        shoppingList: action.payload,
      }

    case actionTypes.GENERATE_SHOPPING_LIST: {
      const ingredients = action.payload
      const newItems = ingredients.map((ing, index) => ({
        id: `${Date.now()}-${index}`,
        name: ing.ingredient,
        quantity: ing.measure,
        checked: false,
        category: 'From Meal Plan',
      }))
      return {
        ...state,
        shoppingList: [...state.shoppingList, ...newItems],
      }
    }

    case actionTypes.ADD_RECIPE_INGREDIENTS: {
      const { ingredients, recipeName } = action.payload
      const newItems = ingredients.map((ing, index) => ({
        id: `${Date.now()}-${index}`,
        name: ing.ingredient,
        quantity: ing.measure,
        checked: false,
        category: recipeName,
      }))
      return {
        ...state,
        shoppingList: [...state.shoppingList, ...newItems],
      }
    }

    // Toast
    case actionTypes.SHOW_TOAST:
      return {
        ...state,
        toast: action.payload,
      }

    case actionTypes.HIDE_TOAST:
      return {
        ...state,
        toast: null,
      }

    // Dark Mode
    case actionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      }

    case actionTypes.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      }

    // Collections
    case actionTypes.CREATE_COLLECTION: {
      const newCollection = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description || '',
        icon: action.payload.icon || '📁',
        color: action.payload.color || 'gray',
        recipeIds: [],
        createdAt: Date.now(),
      }
      return {
        ...state,
        customCollections: [...state.customCollections, newCollection],
      }
    }

    case actionTypes.UPDATE_COLLECTION: {
      const { id, ...updates } = action.payload
      return {
        ...state,
        customCollections: state.customCollections.map(col =>
          col.id === id ? { ...col, ...updates } : col
        ),
      }
    }

    case actionTypes.DELETE_COLLECTION:
      return {
        ...state,
        customCollections: state.customCollections.filter(col => col.id !== action.payload),
      }

    case actionTypes.ADD_TO_COLLECTION: {
      const { collectionId, recipeId } = action.payload
      return {
        ...state,
        customCollections: state.customCollections.map(col =>
          col.id === collectionId && !col.recipeIds.includes(recipeId)
            ? { ...col, recipeIds: [...col.recipeIds, recipeId] }
            : col
        ),
      }
    }

    case actionTypes.REMOVE_FROM_COLLECTION: {
      const { collectionId, recipeId } = action.payload
      return {
        ...state,
        customCollections: state.customCollections.map(col =>
          col.id === collectionId
            ? { ...col, recipeIds: col.recipeIds.filter(id => id !== recipeId) }
            : col
        ),
      }
    }

    case actionTypes.SET_COLLECTIONS:
      return {
        ...state,
        customCollections: action.payload,
      }

    // Dietary Preferences
    case actionTypes.SET_DIETARY_PREFERENCES:
      return {
        ...state,
        dietaryPreferences: action.payload,
      }

    case actionTypes.UPDATE_DIETARY_PREFERENCE: {
      const { key, value } = action.payload
      return {
        ...state,
        dietaryPreferences: {
          ...state.dietaryPreferences,
          [key]: value,
        },
      }
    }

    case actionTypes.TOGGLE_DIETARY_TYPE: {
      const typeId = action.payload
      const currentTypes = state.dietaryPreferences.dietaryTypes || []
      const newTypes = currentTypes.includes(typeId)
        ? currentTypes.filter((t) => t !== typeId)
        : [...currentTypes, typeId]
      return {
        ...state,
        dietaryPreferences: {
          ...state.dietaryPreferences,
          dietaryTypes: newTypes,
        },
      }
    }

    case actionTypes.TOGGLE_ALLERGEN_FREE: {
      const allergenId = action.payload
      const currentAllergens = state.dietaryPreferences.allergenFree || []
      const newAllergens = currentAllergens.includes(allergenId)
        ? currentAllergens.filter((a) => a !== allergenId)
        : [...currentAllergens, allergenId]
      return {
        ...state,
        dietaryPreferences: {
          ...state.dietaryPreferences,
          allergenFree: newAllergens,
        },
      }
    }

    case actionTypes.TOGGLE_HEALTH_OPTION: {
      const optionId = action.payload
      const currentOptions = state.dietaryPreferences.healthOptions || []
      const newOptions = currentOptions.includes(optionId)
        ? currentOptions.filter((o) => o !== optionId)
        : [...currentOptions, optionId]
      return {
        ...state,
        dietaryPreferences: {
          ...state.dietaryPreferences,
          healthOptions: newOptions,
        },
      }
    }

    default:
      return state
  }
}
