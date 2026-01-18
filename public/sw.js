// Service Worker for Kitchen Command
const CACHE_NAME = 'kitchen-command-v2'
const RECIPE_CACHE = 'kitchen-command-recipes-v2'
const IMAGE_CACHE = 'kitchen-command-images-v2'

// Dynamic base path detection based on where the service worker is registered
const getBasePath = () => {
  // Get the service worker's own URL and derive the base path
  const swUrl = self.location.pathname
  // Remove 'sw.js' from the path to get the base
  const basePath = swUrl.replace(/sw\.js$/, '')
  return basePath || '/'
}

const BASE_PATH = getBasePath()

// Static assets to cache on install
const STATIC_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RECIPE_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests (TheMealDB)
  if (url.hostname === 'www.themealdb.com' && url.pathname.includes('/api/')) {
    event.respondWith(networkFirstWithCache(request, RECIPE_CACHE))
    return
  }

  // Handle image requests (TheMealDB images)
  if (url.hostname === 'www.themealdb.com' && url.pathname.includes('/images/')) {
    event.respondWith(cacheFirstWithNetwork(request, IMAGE_CACHE))
    return
  }

  // Handle static assets
  if (request.destination === 'document' ||
      request.destination === 'script' ||
      request.destination === 'style') {
    event.respondWith(networkFirstWithCache(request, CACHE_NAME))
    return
  }

  // Default: network first
  event.respondWith(fetch(request))
})

// Network first, cache as fallback
async function networkFirstWithCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Cache first, network as fallback
async function cacheFirstWithNetwork(request, cacheName) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // Return a placeholder for failed images
    return new Response('', { status: 404, statusText: 'Not Found' })
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_RECIPE') {
    cacheRecipe(event.data.recipe)
  }
  if (event.data.type === 'CACHE_RECIPES') {
    event.data.recipes.forEach(recipe => cacheRecipe(recipe))
  }
  if (event.data.type === 'REMOVE_CACHED_RECIPE') {
    removeCachedRecipe(event.data.recipeId)
  }
})

// Cache a recipe and its image
async function cacheRecipe(recipe) {
  if (!recipe || !recipe.idMeal) return

  try {
    // Cache the recipe data
    const recipeCache = await caches.open(RECIPE_CACHE)
    const recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
    const recipeData = { meals: [recipe] }
    const recipeResponse = new Response(JSON.stringify(recipeData), {
      headers: { 'Content-Type': 'application/json' }
    })
    await recipeCache.put(recipeUrl, recipeResponse)

    // Cache the image
    if (recipe.strMealThumb) {
      const imageCache = await caches.open(IMAGE_CACHE)
      try {
        const imageResponse = await fetch(recipe.strMealThumb)
        if (imageResponse.ok) {
          await imageCache.put(recipe.strMealThumb, imageResponse)
        }
      } catch (e) {
        console.log('Could not cache image:', recipe.strMealThumb)
      }
    }
  } catch (error) {
    console.error('Error caching recipe:', error)
  }
}

// Remove a cached recipe
async function removeCachedRecipe(recipeId) {
  try {
    const recipeCache = await caches.open(RECIPE_CACHE)
    const recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    await recipeCache.delete(recipeUrl)
  } catch (error) {
    console.error('Error removing cached recipe:', error)
  }
}
