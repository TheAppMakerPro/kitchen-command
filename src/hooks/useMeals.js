import { useState, useEffect, useCallback, useRef } from 'react'
import * as api from '../api/mealdb'

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const meals = await api.searchMeals(searchQuery)
      setResults(meals)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      search(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, search])

  return { query, setQuery, results, loading, error, search }
}

export function useMeal(id) {
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchMeal = useCallback(async (mealId) => {
    if (!mealId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await api.getMealById(mealId)
      setMeal(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeal(id)
  }, [id, retryCount, fetchMeal])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { meal, loading, error, retry }
}

export function useRandomMeal() {
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await api.getRandomMeal()
      setMeal(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRandom()
  }, [fetchRandom])

  return { meal, loading, error, refresh: fetchRandom }
}

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      try {
        const data = await api.getCategories()
        if (!cancelled) {
          setCategories(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { categories, loading, error, retry }
}

export function useAreas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      try {
        const data = await api.getAreas()
        if (!cancelled) {
          setAreas(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { areas, loading, error, retry }
}

// Combined search + filter hook - allows simultaneous search and category/area filtering
export function useCombinedSearch() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(null)
  const [area, setArea] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const performSearch = useCallback(async (searchQuery, filterCategory, filterArea) => {
    const hasQuery = searchQuery && searchQuery.trim() !== ''
    const hasFilter = filterCategory || filterArea

    // No search criteria - clear results
    if (!hasQuery && !hasFilter) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      let finalResults = []

      if (hasQuery && hasFilter) {
        // Both search and filter active - fetch both and intersect
        const [searchResults, filterResults] = await Promise.all([
          api.searchMeals(searchQuery),
          filterCategory
            ? api.filterByCategory(filterCategory)
            : api.filterByArea(filterArea)
        ])

        // Create set of filter result IDs for fast lookup
        const filterIds = new Set(filterResults.map(meal => meal.idMeal))

        // Return only search results that match the filter
        finalResults = searchResults.filter(meal => filterIds.has(meal.idMeal))
      } else if (hasQuery) {
        // Only search query
        finalResults = await api.searchMeals(searchQuery)
      } else {
        // Only filter
        finalResults = filterCategory
          ? await api.filterByCategory(filterCategory)
          : await api.filterByArea(filterArea)
      }

      setResults(finalResults)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query, category, area)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, category, area, performSearch])

  const clearAll = useCallback(() => {
    setQuery('')
    setCategory(null)
    setArea(null)
    setResults([])
  }, [])

  const retry = useCallback(() => {
    performSearch(query, category, area)
  }, [query, category, area, performSearch])

  return {
    query,
    setQuery,
    category,
    setCategory,
    area,
    setArea,
    results,
    loading,
    error,
    clearAll,
    retry,
  }
}

// Get personalized recommendations based on favorites
export function useRecommendations(favorites, limit = 8) {
  const [recommendations, setRecommendations] = useState([])
  const [basedOn, setBasedOn] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setRecommendations([])
      setBasedOn(null)
      return
    }

    let cancelled = false

    async function fetchRecommendations() {
      setLoading(true)

      try {
        // Pick a random favorite to base recommendations on
        const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)]
        setBasedOn(randomFavorite)

        // Get recipes from the same category
        const categoryRecipes = randomFavorite.strCategory
          ? await api.filterByCategory(randomFavorite.strCategory)
          : []

        // Filter out favorites and limit results
        const favoriteIds = new Set(favorites.map(f => f.idMeal))
        const filtered = categoryRecipes
          .filter(r => !favoriteIds.has(r.idMeal))
          .slice(0, limit)

        if (!cancelled) {
          setRecommendations(filtered)
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        if (!cancelled) {
          setRecommendations([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRecommendations()

    return () => {
      cancelled = true
    }
  }, [favorites, limit])

  return { recommendations, basedOn, loading }
}

// Get quick & easy recipes (breakfast, side dishes, starters)
export function useQuickRecipes(limit = 8) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchQuickRecipes() {
      try {
        // Get recipes from categories that are typically quick
        const [breakfast, sides, starters] = await Promise.all([
          api.filterByCategory('Breakfast'),
          api.filterByCategory('Side'),
          api.filterByCategory('Starter'),
        ])

        // Combine and shuffle
        const all = [...breakfast, ...sides, ...starters]
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, limit)

        if (!cancelled) {
          setRecipes(shuffled)
        }
      } catch (err) {
        console.error('Error fetching quick recipes:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchQuickRecipes()

    return () => {
      cancelled = true
    }
  }, [limit])

  return { recipes, loading }
}

// Get seasonal/curated picks
export function useSeasonalPicks(limit = 6) {
  const [picks, setPicks] = useState([])
  const [season, setSeason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchSeasonalPicks() {
      // Determine current season
      const month = new Date().getMonth()
      let currentSeason, categories

      if (month >= 2 && month <= 4) {
        currentSeason = 'Spring'
        categories = ['Vegetarian', 'Salad', 'Seafood']
      } else if (month >= 5 && month <= 7) {
        currentSeason = 'Summer'
        categories = ['Seafood', 'Salad', 'Vegetarian']
      } else if (month >= 8 && month <= 10) {
        currentSeason = 'Autumn'
        categories = ['Beef', 'Lamb', 'Pasta']
      } else {
        currentSeason = 'Winter'
        categories = ['Beef', 'Lamb', 'Soup']
      }

      setSeason(currentSeason)

      try {
        // Fetch from seasonal categories
        const results = await Promise.all(
          categories.map(cat => api.filterByCategory(cat))
        )

        // Combine, shuffle, and limit
        const all = results.flat()
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, limit)

        if (!cancelled) {
          setPicks(shuffled)
        }
      } catch (err) {
        console.error('Error fetching seasonal picks:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSeasonalPicks()

    return () => {
      cancelled = true
    }
  }, [limit])

  return { picks, season, loading }
}

// Fetch all available ingredients
export function useIngredients() {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)

      try {
        const data = await api.getIngredients()
        if (!cancelled) {
          setIngredients(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetch()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { ingredients, loading, error, retry }
}

// Search by multiple ingredients - finds recipes containing ANY of the selected ingredients
export function useIngredientSearch() {
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [matchCounts, setMatchCounts] = useState({}) // Track how many ingredients each recipe matches

  const searchByIngredients = useCallback(async (ingredients) => {
    if (!ingredients || ingredients.length === 0) {
      setResults([])
      setMatchCounts({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch recipes for each ingredient in parallel
      const allResults = await Promise.all(
        ingredients.map(ing => api.filterByIngredient(ing))
      )

      // Count how many times each recipe appears (how many ingredients it matches)
      const recipeMatchCount = {}
      const recipeData = {}

      allResults.forEach((meals) => {
        meals.forEach((meal) => {
          if (!recipeMatchCount[meal.idMeal]) {
            recipeMatchCount[meal.idMeal] = 0
            recipeData[meal.idMeal] = meal
          }
          recipeMatchCount[meal.idMeal]++
        })
      })

      // Convert to array and sort by match count (most matches first)
      const sortedRecipes = Object.keys(recipeData)
        .map(id => recipeData[id])
        .sort((a, b) => recipeMatchCount[b.idMeal] - recipeMatchCount[a.idMeal])

      setResults(sortedRecipes)
      setMatchCounts(recipeMatchCount)
    } catch (err) {
      setError(err.message)
      setResults([])
      setMatchCounts({})
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-search when ingredients change
  useEffect(() => {
    searchByIngredients(selectedIngredients)
  }, [selectedIngredients, searchByIngredients])

  const addIngredient = useCallback((ingredient) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient) ? prev : [...prev, ingredient]
    )
  }, [])

  const removeIngredient = useCallback((ingredient) => {
    setSelectedIngredients(prev => prev.filter(i => i !== ingredient))
  }, [])

  const clearIngredients = useCallback(() => {
    setSelectedIngredients([])
  }, [])

  const retry = useCallback(() => {
    searchByIngredients(selectedIngredients)
  }, [selectedIngredients, searchByIngredients])

  return {
    selectedIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    results,
    matchCounts,
    loading,
    error,
    retry,
  }
}

// Smart Collections - predefined and auto-filtered collections
export const SMART_COLLECTIONS = [
  {
    id: 'weeknight-dinners',
    name: 'Weeknight Dinners',
    description: 'Quick meals ready in under 30 minutes',
    icon: '🌙',
    color: 'indigo',
    type: 'smart',
    filter: (meals) => meals, // All fetched meals qualify (we fetch quick categories)
    categories: ['Chicken', 'Pasta', 'Seafood', 'Pork'],
  },
  {
    id: 'meal-prep-sundays',
    name: 'Meal Prep Sundays',
    description: 'Perfect for batch cooking and weekly prep',
    icon: '📦',
    color: 'blue',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Beef', 'Chicken', 'Lamb', 'Pasta'],
  },
  {
    id: 'date-night',
    name: 'Date Night',
    description: 'Impressive dishes for special occasions',
    icon: '💕',
    color: 'rose',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Seafood', 'Beef', 'Lamb', 'Pasta'],
  },
  {
    id: 'kid-friendly',
    name: 'Kid-Friendly',
    description: 'Dishes the whole family will love',
    icon: '👶',
    color: 'amber',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Chicken', 'Pasta', 'Breakfast', 'Dessert'],
  },
  {
    id: 'budget-meals',
    name: 'Budget Meals',
    description: 'Delicious recipes that won\'t break the bank',
    icon: '💰',
    color: 'emerald',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Pasta', 'Vegetarian', 'Side', 'Miscellaneous'],
  },
  {
    id: 'healthy-eating',
    name: 'Healthy Eating',
    description: 'Nutritious meals for a balanced diet',
    icon: '🥗',
    color: 'green',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Vegetarian', 'Seafood', 'Salad', 'Vegan'],
  },
  {
    id: 'comfort-food',
    name: 'Comfort Food',
    description: 'Hearty, soul-warming classics',
    icon: '🍲',
    color: 'orange',
    type: 'smart',
    filter: (meals) => meals,
    categories: ['Beef', 'Pasta', 'Pork', 'Lamb'],
  },
  {
    id: 'world-cuisine',
    name: 'World Cuisine',
    description: 'Explore flavors from around the globe',
    icon: '🌍',
    color: 'purple',
    type: 'smart',
    filter: (meals) => meals,
    areas: ['Japanese', 'Indian', 'Mexican', 'Thai', 'Chinese', 'Italian'],
  },
]

export function useSmartCollection(collectionId) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const collection = SMART_COLLECTIONS.find(c => c.id === collectionId)

  useEffect(() => {
    if (!collection) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchCollectionRecipes() {
      setLoading(true)
      setError(null)

      try {
        let allRecipes = []

        if (collection.categories) {
          // Fetch from categories
          const results = await Promise.all(
            collection.categories.map(cat => api.filterByCategory(cat))
          )
          allRecipes = results.flat()
        } else if (collection.areas) {
          // Fetch from areas/cuisines
          const results = await Promise.all(
            collection.areas.map(area => api.filterByArea(area))
          )
          allRecipes = results.flat()
        }

        // Remove duplicates by idMeal
        const uniqueRecipes = Array.from(
          new Map(allRecipes.map(r => [r.idMeal, r])).values()
        )

        // Apply collection filter and shuffle
        const filtered = collection.filter ? collection.filter(uniqueRecipes) : uniqueRecipes
        const shuffled = filtered.sort(() => Math.random() - 0.5)

        if (!cancelled) {
          setRecipes(shuffled)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCollectionRecipes()

    return () => {
      cancelled = true
    }
  }, [collectionId, collection, retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { collection, recipes, loading, error, retry }
}

// Fetch recipes by IDs (for custom collections)
export function useRecipesByIds(recipeIds) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!recipeIds || recipeIds.length === 0) {
      setRecipes([])
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchRecipes() {
      setLoading(true)
      setError(null)

      try {
        // Fetch all recipes in parallel
        const results = await Promise.all(
          recipeIds.map(id => api.getMealById(id))
        )

        // Filter out any null results
        const validRecipes = results.filter(r => r !== null)

        if (!cancelled) {
          setRecipes(validRecipes)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRecipes()

    return () => {
      cancelled = true
    }
  }, [recipeIds?.join(','), retryCount])

  const retry = useCallback(() => {
    setRetryCount(c => c + 1)
  }, [])

  return { recipes, loading, error, retry }
}

export function useFilter() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null })

  const filterByCategory = useCallback(async (category) => {
    setLoading(true)
    setError(null)
    setActiveFilter({ type: 'category', value: category })

    try {
      const data = await api.filterByCategory(category)
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const filterByArea = useCallback(async (area) => {
    setLoading(true)
    setError(null)
    setActiveFilter({ type: 'area', value: area })

    try {
      const data = await api.filterByArea(area)
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const filterByIngredient = useCallback(async (ingredient) => {
    setLoading(true)
    setError(null)
    setActiveFilter({ type: 'ingredient', value: ingredient })

    try {
      const data = await api.filterByIngredient(ingredient)
      setResults(data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearFilter = useCallback(() => {
    setResults([])
    setActiveFilter({ type: null, value: null })
  }, [])

  const retry = useCallback(() => {
    if (!activeFilter.type || !activeFilter.value) return

    if (activeFilter.type === 'category') {
      filterByCategory(activeFilter.value)
    } else if (activeFilter.type === 'area') {
      filterByArea(activeFilter.value)
    } else if (activeFilter.type === 'ingredient') {
      filterByIngredient(activeFilter.value)
    }
  }, [activeFilter, filterByCategory, filterByArea, filterByIngredient])

  return {
    results,
    loading,
    error,
    activeFilter,
    filterByCategory,
    filterByArea,
    filterByIngredient,
    clearFilter,
    retry,
  }
}
