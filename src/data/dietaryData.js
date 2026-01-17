// Common allergens with ingredient keywords
export const ALLERGENS = {
  gluten: {
    id: 'gluten',
    name: 'Gluten',
    icon: '🌾',
    color: 'amber',
    keywords: [
      'flour', 'wheat', 'bread', 'pasta', 'noodles', 'spaghetti', 'macaroni',
      'lasagne', 'couscous', 'bulgur', 'seitan', 'barley', 'rye', 'oats',
      'breadcrumbs', 'panko', 'croutons', 'tortilla', 'pita', 'naan',
      'biscuit', 'cookie', 'cake', 'pastry', 'croissant', 'filo', 'phyllo'
    ],
  },
  dairy: {
    id: 'dairy',
    name: 'Dairy',
    icon: '🥛',
    color: 'blue',
    keywords: [
      'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'ghee',
      'parmesan', 'mozzarella', 'cheddar', 'feta', 'ricotta', 'mascarpone',
      'brie', 'camembert', 'gruyere', 'gouda', 'halloumi', 'paneer',
      'cottage cheese', 'sour cream', 'creme', 'whey', 'casein'
    ],
  },
  eggs: {
    id: 'eggs',
    name: 'Eggs',
    icon: '🥚',
    color: 'yellow',
    keywords: ['egg', 'eggs', 'mayonnaise', 'mayo', 'meringue', 'aioli'],
  },
  nuts: {
    id: 'nuts',
    name: 'Tree Nuts',
    icon: '🥜',
    color: 'orange',
    keywords: [
      'almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'hazelnut',
      'macadamia', 'pine nut', 'brazil nut', 'chestnut', 'praline',
      'marzipan', 'frangipane', 'nutella'
    ],
  },
  peanuts: {
    id: 'peanuts',
    name: 'Peanuts',
    icon: '🥜',
    color: 'amber',
    keywords: ['peanut', 'groundnut', 'peanut butter', 'satay'],
  },
  shellfish: {
    id: 'shellfish',
    name: 'Shellfish',
    icon: '🦐',
    color: 'rose',
    keywords: [
      'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'crawfish',
      'scallop', 'clam', 'mussel', 'oyster', 'squid', 'calamari',
      'octopus', 'snail', 'escargot'
    ],
  },
  fish: {
    id: 'fish',
    name: 'Fish',
    icon: '🐟',
    color: 'cyan',
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'haddock', 'mackerel', 'sardine',
      'anchovy', 'trout', 'bass', 'tilapia', 'snapper', 'halibut',
      'swordfish', 'catfish', 'fish sauce', 'worcestershire'
    ],
  },
  soy: {
    id: 'soy',
    name: 'Soy',
    icon: '🫘',
    color: 'green',
    keywords: [
      'soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso', 'soy sauce',
      'tamari', 'teriyaki'
    ],
  },
  sesame: {
    id: 'sesame',
    name: 'Sesame',
    icon: '⚪',
    color: 'stone',
    keywords: ['sesame', 'tahini', 'hummus', 'halvah', 'gomashio'],
  },
}

// Meat/protein ingredients for dietary filtering
export const MEAT_INGREDIENTS = {
  redMeat: [
    'beef', 'steak', 'lamb', 'mutton', 'pork', 'bacon', 'ham', 'sausage',
    'veal', 'venison', 'goat', 'mince', 'minced meat', 'ground beef',
    'brisket', 'ribs', 'chorizo', 'prosciutto', 'salami', 'pepperoni'
  ],
  poultry: [
    'chicken', 'turkey', 'duck', 'goose', 'quail', 'pheasant',
    'chicken breast', 'chicken thigh', 'chicken wing', 'drumstick'
  ],
  pork: [
    'pork', 'bacon', 'ham', 'sausage', 'chorizo', 'prosciutto',
    'pancetta', 'lard', 'pork chop', 'pork belly', 'pulled pork'
  ],
  seafood: [
    'fish', 'salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'crab', 'lobster',
    'scallop', 'clam', 'mussel', 'oyster', 'squid', 'calamari', 'octopus',
    'anchovy', 'sardine', 'mackerel', 'trout', 'bass', 'tilapia'
  ],
}

// Dietary categories
export const DIETARY_TYPES = {
  vegetarian: {
    id: 'vegetarian',
    name: 'Vegetarian',
    icon: '🥬',
    color: 'green',
    description: 'No meat or fish',
    excludes: [...MEAT_INGREDIENTS.redMeat, ...MEAT_INGREDIENTS.poultry, ...MEAT_INGREDIENTS.pork, ...MEAT_INGREDIENTS.seafood],
  },
  vegan: {
    id: 'vegan',
    name: 'Vegan',
    icon: '🌱',
    color: 'emerald',
    description: 'No animal products',
    excludes: [
      ...MEAT_INGREDIENTS.redMeat, ...MEAT_INGREDIENTS.poultry,
      ...MEAT_INGREDIENTS.pork, ...MEAT_INGREDIENTS.seafood,
      ...ALLERGENS.dairy.keywords, ...ALLERGENS.eggs.keywords,
      'honey', 'gelatin', 'gelatine'
    ],
  },
  pescatarian: {
    id: 'pescatarian',
    name: 'Pescatarian',
    icon: '🐟',
    color: 'cyan',
    description: 'Fish but no meat',
    excludes: [...MEAT_INGREDIENTS.redMeat, ...MEAT_INGREDIENTS.poultry, ...MEAT_INGREDIENTS.pork],
  },
  halal: {
    id: 'halal',
    name: 'Halal',
    icon: '☪️',
    color: 'emerald',
    description: 'No pork or alcohol',
    excludes: [...MEAT_INGREDIENTS.pork, 'wine', 'beer', 'alcohol', 'rum', 'brandy', 'vodka', 'whiskey', 'liqueur', 'sherry', 'marsala'],
  },
  kosher: {
    id: 'kosher',
    name: 'Kosher',
    icon: '✡️',
    color: 'blue',
    description: 'No pork or shellfish, no mixing meat and dairy',
    excludes: [...MEAT_INGREDIENTS.pork, ...ALLERGENS.shellfish.keywords],
  },
}

// Health-conscious options
export const HEALTH_OPTIONS = {
  lowSodium: {
    id: 'lowSodium',
    name: 'Low Sodium',
    icon: '🧂',
    color: 'slate',
    description: 'Reduced salt content',
    highSodiumIngredients: [
      'salt', 'soy sauce', 'fish sauce', 'miso', 'bacon', 'ham',
      'sausage', 'anchovies', 'olives', 'capers', 'pickles',
      'parmesan', 'feta', 'worcestershire', 'stock cube', 'bouillon'
    ],
  },
  lowSugar: {
    id: 'lowSugar',
    name: 'Low Sugar',
    icon: '🍬',
    color: 'pink',
    description: 'Reduced sugar content',
    highSugarIngredients: [
      'sugar', 'honey', 'maple syrup', 'molasses', 'agave',
      'corn syrup', 'chocolate', 'caramel', 'condensed milk',
      'jam', 'jelly', 'marmalade', 'icing', 'frosting'
    ],
  },
}

// Extract ingredients from a meal object
export function extractIngredients(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(ingredient.toLowerCase().trim())
    }
  }
  return ingredients
}

// Detect allergens in a recipe
export function detectAllergens(meal) {
  const ingredients = extractIngredients(meal)
  const ingredientText = ingredients.join(' ')
  const detected = []

  Object.values(ALLERGENS).forEach((allergen) => {
    const hasAllergen = allergen.keywords.some((keyword) =>
      ingredientText.includes(keyword.toLowerCase())
    )
    if (hasAllergen) {
      detected.push(allergen)
    }
  })

  return detected
}

// Check if recipe matches dietary type
export function matchesDietaryType(meal, dietaryTypeId) {
  const dietaryType = DIETARY_TYPES[dietaryTypeId]
  if (!dietaryType) return true

  const ingredients = extractIngredients(meal)
  const ingredientText = ingredients.join(' ')

  // Check if any excluded ingredient is present
  const hasExcluded = dietaryType.excludes.some((excluded) =>
    ingredientText.includes(excluded.toLowerCase())
  )

  return !hasExcluded
}

// Check multiple dietary types
export function matchesDietaryTypes(meal, dietaryTypeIds) {
  if (!dietaryTypeIds || dietaryTypeIds.length === 0) return true
  return dietaryTypeIds.every((id) => matchesDietaryType(meal, id))
}

// Check health options
export function checkHealthOption(meal, optionId) {
  const option = HEALTH_OPTIONS[optionId]
  if (!option) return { suitable: true, warnings: [] }

  const ingredients = extractIngredients(meal)
  const ingredientText = ingredients.join(' ')
  const warnings = []

  const problematicIngredients = optionId === 'lowSodium'
    ? option.highSodiumIngredients
    : option.highSugarIngredients

  problematicIngredients.forEach((ingredient) => {
    if (ingredientText.includes(ingredient.toLowerCase())) {
      warnings.push(ingredient)
    }
  })

  return {
    suitable: warnings.length === 0,
    warnings,
  }
}

// Get dietary badges for a recipe
export function getDietaryBadges(meal) {
  const badges = []

  // Check if vegetarian (from TheMealDB category)
  if (meal.strCategory === 'Vegetarian') {
    badges.push({ ...DIETARY_TYPES.vegetarian, source: 'category' })
  } else if (matchesDietaryType(meal, 'vegetarian')) {
    badges.push({ ...DIETARY_TYPES.vegetarian, source: 'inferred' })
  }

  // Check vegan
  if (matchesDietaryType(meal, 'vegan')) {
    badges.push({ ...DIETARY_TYPES.vegan, source: 'inferred' })
  }

  // Check halal
  if (matchesDietaryType(meal, 'halal')) {
    badges.push({ ...DIETARY_TYPES.halal, source: 'inferred' })
  }

  return badges
}

// Filter recipes by user preferences
export function filterByDietaryPreferences(meals, preferences) {
  if (!preferences || !meals) return meals

  return meals.filter((meal) => {
    // Check dietary types
    if (preferences.dietaryTypes && preferences.dietaryTypes.length > 0) {
      if (!matchesDietaryTypes(meal, preferences.dietaryTypes)) {
        return false
      }
    }

    // Check allergens to avoid
    if (preferences.allergenFree && preferences.allergenFree.length > 0) {
      const detectedAllergens = detectAllergens(meal)
      const allergenIds = detectedAllergens.map((a) => a.id)
      const hasUnwantedAllergen = preferences.allergenFree.some((id) =>
        allergenIds.includes(id)
      )
      if (hasUnwantedAllergen) {
        return false
      }
    }

    return true
  })
}
