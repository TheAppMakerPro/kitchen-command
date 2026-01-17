const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

// Cache for categories and areas (they rarely change)
let categoriesCache = null
let areasCache = null

export async function searchMeals(query) {
  if (!query || query.trim() === '') return []

  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`)
  const data = await response.json()
  return data.meals || []
}

export async function getMealById(id) {
  if (!id) return null

  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
  const data = await response.json()
  return data.meals?.[0] || null
}

export async function getRandomMeal() {
  const response = await fetch(`${BASE_URL}/random.php`)
  const data = await response.json()
  return data.meals?.[0] || null
}

export async function getCategories() {
  if (categoriesCache) return categoriesCache

  const response = await fetch(`${BASE_URL}/categories.php`)
  const data = await response.json()
  categoriesCache = data.categories || []
  return categoriesCache
}

export async function getAreas() {
  if (areasCache) return areasCache

  const response = await fetch(`${BASE_URL}/list.php?a=list`)
  const data = await response.json()
  areasCache = data.meals?.map(m => m.strArea) || []
  return areasCache
}

export async function getIngredients() {
  const response = await fetch(`${BASE_URL}/list.php?i=list`)
  const data = await response.json()
  return data.meals?.map(m => m.strIngredient) || []
}

export async function filterByCategory(category) {
  if (!category) return []

  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
  const data = await response.json()
  return data.meals || []
}

export async function filterByArea(area) {
  if (!area) return []

  const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`)
  const data = await response.json()
  return data.meals || []
}

export async function filterByIngredient(ingredient) {
  if (!ingredient) return []

  const response = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
  const data = await response.json()
  return data.meals || []
}

export async function getMealsByFirstLetter(letter) {
  if (!letter) return []

  const response = await fetch(`${BASE_URL}/search.php?f=${letter}`)
  const data = await response.json()
  return data.meals || []
}

// Helper function to extract ingredients from a meal object
export function extractIngredients(meal) {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || '',
      })
    }
  }

  return ingredients
}

// Helper to count ingredients in a meal
export function countIngredients(meal) {
  if (!meal) return 0
  let count = 0
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    if (ingredient && ingredient.trim()) {
      count++
    }
  }
  return count
}

// Helper to estimate cooking time based on category and meal ID (deterministic)
export function estimateCookingTime(meal) {
  if (!meal) return null

  // Use meal ID to create deterministic but varied times
  const idNum = parseInt(meal.idMeal, 10) || 0
  const baseTime = (idNum % 6) * 10 + 15 // 15, 25, 35, 45, 55, 65

  // Adjust based on category
  const category = meal.strCategory?.toLowerCase() || ''
  let adjustment = 0

  if (category.includes('breakfast') || category.includes('starter')) {
    adjustment = -10
  } else if (category.includes('dessert') || category.includes('side')) {
    adjustment = -5
  } else if (category.includes('beef') || category.includes('lamb') || category.includes('pork')) {
    adjustment = 15
  } else if (category.includes('pasta')) {
    adjustment = 5
  }

  const finalTime = Math.max(10, Math.min(90, baseTime + adjustment))
  return finalTime
}

// Helper to estimate difficulty based on ingredient count
export function estimateDifficulty(meal) {
  const ingredientCount = countIngredients(meal)

  if (ingredientCount === 0) {
    // Use category as fallback
    const category = meal?.strCategory?.toLowerCase() || ''
    if (category.includes('breakfast') || category.includes('side')) return 'Easy'
    if (category.includes('beef') || category.includes('lamb')) return 'Medium'
    return 'Easy'
  }

  if (ingredientCount <= 5) return 'Easy'
  if (ingredientCount <= 10) return 'Medium'
  return 'Hard'
}

// Helper to estimate servings based on category
export function estimateServings(meal) {
  if (!meal) return 4

  const category = meal.strCategory?.toLowerCase() || ''
  const idNum = parseInt(meal.idMeal, 10) || 0

  // Deterministic variation
  const variation = (idNum % 3) // 0, 1, or 2

  if (category.includes('dessert')) {
    return 6 + variation * 2 // 6, 8, or 10
  } else if (category.includes('breakfast') || category.includes('side')) {
    return 2 + variation // 2, 3, or 4
  } else if (category.includes('starter')) {
    return 4 + variation * 2 // 4, 6, or 8
  }

  return 4 + variation // 4, 5, or 6 for main dishes
}

// Helper to get YouTube embed URL from video URL
export function getYouTubeEmbedUrl(url) {
  if (!url) return null

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}
