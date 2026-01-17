// Recipe Enhancement Data and Utilities

// ==================== TIME ESTIMATION ====================

// Keywords that indicate longer cooking times
const SLOW_COOK_KEYWORDS = ['braise', 'slow cook', 'stew', 'roast', 'bake', 'simmer', 'marinate']
const QUICK_COOK_KEYWORDS = ['stir fry', 'stir-fry', 'sauté', 'saute', 'grill', 'pan fry', 'flash']

// Base times by category (in minutes)
const CATEGORY_TIMES = {
  'Beef': { prep: 20, cook: 45 },
  'Chicken': { prep: 15, cook: 35 },
  'Lamb': { prep: 20, cook: 50 },
  'Pork': { prep: 15, cook: 40 },
  'Seafood': { prep: 15, cook: 20 },
  'Pasta': { prep: 15, cook: 20 },
  'Vegetarian': { prep: 15, cook: 25 },
  'Vegan': { prep: 15, cook: 25 },
  'Breakfast': { prep: 10, cook: 15 },
  'Dessert': { prep: 20, cook: 30 },
  'Side': { prep: 10, cook: 20 },
  'Starter': { prep: 15, cook: 15 },
  'Miscellaneous': { prep: 15, cook: 30 },
  'Goat': { prep: 20, cook: 50 },
  'default': { prep: 15, cook: 30 },
}

export function estimateTimes(meal) {
  const category = meal.strCategory || 'default'
  const instructions = (meal.strInstructions || '').toLowerCase()
  const mealName = (meal.strMeal || '').toLowerCase()

  let baseTimes = CATEGORY_TIMES[category] || CATEGORY_TIMES['default']
  let { prep, cook } = { ...baseTimes }

  // Adjust for slow cooking methods
  if (SLOW_COOK_KEYWORDS.some(kw => instructions.includes(kw) || mealName.includes(kw))) {
    cook = Math.max(cook, 60)
    if (instructions.includes('hours') || instructions.includes('slow cook')) {
      cook = Math.max(cook, 120)
    }
  }

  // Adjust for quick cooking methods
  if (QUICK_COOK_KEYWORDS.some(kw => instructions.includes(kw) || mealName.includes(kw))) {
    cook = Math.min(cook, 20)
  }

  // Adjust prep time based on ingredient count
  const ingredientCount = countIngredients(meal)
  if (ingredientCount > 10) prep += 10
  if (ingredientCount > 15) prep += 10

  // Check for marinating time
  if (instructions.includes('marinat')) {
    prep += 30 // Add marinating time to prep
  }

  return { prepTime: prep, cookTime: cook, totalTime: prep + cook }
}

function countIngredients(meal) {
  let count = 0
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]?.trim()) count++
  }
  return count
}

// ==================== DIFFICULTY ESTIMATION ====================

const DIFFICULT_TECHNIQUES = [
  'julienne', 'brunoise', 'chiffonade', 'temper', 'fold', 'flambé', 'flambe',
  'deglaze', 'reduce', 'emulsify', 'caramelize', 'blanch', 'braise',
  'poach', 'confit', 'cure', 'ferment', 'smoke'
]

const EASY_KEYWORDS = ['simple', 'easy', 'quick', 'basic', 'beginner']

export function estimateDifficulty(meal) {
  const instructions = (meal.strInstructions || '').toLowerCase()
  const mealName = (meal.strMeal || '').toLowerCase()
  const ingredientCount = countIngredients(meal)

  let score = 2 // Start at medium (2 out of 5)

  // Check for difficult techniques
  const techniquesUsed = DIFFICULT_TECHNIQUES.filter(t => instructions.includes(t))
  score += Math.min(techniquesUsed.length, 2)

  // Check for easy keywords
  if (EASY_KEYWORDS.some(kw => mealName.includes(kw) || instructions.includes(kw))) {
    score -= 1
  }

  // Adjust for ingredient count
  if (ingredientCount > 12) score += 1
  if (ingredientCount < 6) score -= 1

  // Adjust for instruction length (complexity indicator)
  const instructionSteps = instructions.split(/[.!?]/).filter(s => s.trim().length > 10).length
  if (instructionSteps > 10) score += 1
  if (instructionSteps < 4) score -= 1

  // Clamp between 1 and 5
  score = Math.max(1, Math.min(5, score))

  const labels = ['Easy', 'Easy', 'Medium', 'Medium-Hard', 'Hard']
  return {
    level: score,
    label: labels[score - 1],
  }
}

// ==================== SERVING SIZE ====================

const SERVING_BY_CATEGORY = {
  'Beef': { servings: 4, yield: '4 portions' },
  'Chicken': { servings: 4, yield: '4 portions' },
  'Lamb': { servings: 4, yield: '4 portions' },
  'Pork': { servings: 4, yield: '4 portions' },
  'Seafood': { servings: 4, yield: '4 portions' },
  'Pasta': { servings: 4, yield: 'About 6 cups cooked' },
  'Vegetarian': { servings: 4, yield: '4 portions' },
  'Vegan': { servings: 4, yield: '4 portions' },
  'Breakfast': { servings: 2, yield: '2 servings' },
  'Dessert': { servings: 8, yield: '8 slices/portions' },
  'Side': { servings: 6, yield: '6 side servings' },
  'Starter': { servings: 6, yield: '6 appetizer portions' },
  'Miscellaneous': { servings: 4, yield: '4 portions' },
  'Goat': { servings: 4, yield: '4 portions' },
}

export function estimateServings(meal) {
  const category = meal.strCategory || 'Miscellaneous'
  return SERVING_BY_CATEGORY[category] || { servings: 4, yield: '4 portions' }
}

// ==================== DIETARY TAGS ====================

// Non-vegan ingredients
const ANIMAL_PRODUCTS = [
  'chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'cod', 'prawns', 'shrimp',
  'bacon', 'sausage', 'ham', 'turkey', 'duck', 'goat', 'venison', 'rabbit',
  'egg', 'eggs', 'milk', 'cream', 'butter', 'cheese', 'yogurt', 'honey',
  'anchov', 'sardine', 'mackerel', 'crab', 'lobster', 'mussel', 'clam', 'oyster',
  'gelatin', 'lard', 'suet', 'stock cube', 'chicken stock', 'beef stock',
  'worcestershire', 'fish sauce', 'oyster sauce'
]

// Non-vegetarian ingredients
const MEAT_PRODUCTS = [
  'chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'cod', 'prawns', 'shrimp',
  'bacon', 'sausage', 'ham', 'turkey', 'duck', 'goat', 'venison', 'rabbit',
  'anchov', 'sardine', 'mackerel', 'crab', 'lobster', 'mussel', 'clam', 'oyster',
  'gelatin', 'lard', 'suet', 'chicken stock', 'beef stock', 'fish sauce'
]

// Dairy products
const DAIRY_PRODUCTS = [
  'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'ghee',
  'parmesan', 'mozzarella', 'cheddar', 'feta', 'ricotta', 'mascarpone',
  'brie', 'camembert', 'gruyere', 'gouda', 'sour cream', 'creme fraiche',
  'whipping cream', 'double cream', 'single cream', 'buttermilk'
]

// Gluten-containing ingredients
const GLUTEN_INGREDIENTS = [
  'flour', 'bread', 'pasta', 'spaghetti', 'noodles', 'couscous', 'bulgur',
  'wheat', 'barley', 'rye', 'semolina', 'farina', 'breadcrumbs', 'panko',
  'cracker', 'tortilla', 'pita', 'naan', 'baguette', 'croissant',
  'beer', 'ale', 'soy sauce', 'teriyaki'
]

// Nut ingredients
const NUT_INGREDIENTS = [
  'almond', 'cashew', 'peanut', 'walnut', 'pecan', 'hazelnut', 'pistachio',
  'macadamia', 'pine nut', 'chestnut', 'brazil nut', 'nut butter',
  'marzipan', 'praline', 'nougat', 'pesto' // pesto typically contains pine nuts
]

export function detectDietaryTags(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.toLowerCase().trim()
    if (ing) ingredients.push(ing)
  }

  const allIngredients = ingredients.join(' ')
  const tags = []

  // Check Vegan
  const hasAnimalProducts = ANIMAL_PRODUCTS.some(p => allIngredients.includes(p))
  if (!hasAnimalProducts) {
    tags.push({ id: 'vegan', label: 'Vegan', color: 'green', icon: '🌱' })
  }

  // Check Vegetarian
  const hasMeat = MEAT_PRODUCTS.some(p => allIngredients.includes(p))
  if (!hasMeat) {
    tags.push({ id: 'vegetarian', label: 'Vegetarian', color: 'green', icon: '🥬' })
  }

  // Check Dairy-Free
  const hasDairy = DAIRY_PRODUCTS.some(p => allIngredients.includes(p))
  if (!hasDairy) {
    tags.push({ id: 'dairy-free', label: 'Dairy-Free', color: 'blue', icon: '🥛' })
  }

  // Check Gluten-Free
  const hasGluten = GLUTEN_INGREDIENTS.some(p => allIngredients.includes(p))
  if (!hasGluten) {
    tags.push({ id: 'gluten-free', label: 'Gluten-Free', color: 'amber', icon: '🌾' })
  }

  // Check Nut-Free
  const hasNuts = NUT_INGREDIENTS.some(p => allIngredients.includes(p))
  if (!hasNuts) {
    tags.push({ id: 'nut-free', label: 'Nut-Free', color: 'purple', icon: '🥜' })
  }

  // Check if it's high protein (meat-based main dishes)
  if (hasMeat && ['Beef', 'Chicken', 'Lamb', 'Pork', 'Seafood'].includes(meal.strCategory)) {
    tags.push({ id: 'high-protein', label: 'High Protein', color: 'red', icon: '💪' })
  }

  // Check for low-carb (no pasta, rice, bread, potato)
  const highCarbIngredients = ['pasta', 'rice', 'bread', 'potato', 'noodle', 'flour']
  const hasHighCarb = highCarbIngredients.some(p => allIngredients.includes(p))
  if (!hasHighCarb && hasMeat) {
    tags.push({ id: 'low-carb', label: 'Low Carb', color: 'teal', icon: '🥩' })
  }

  return tags
}

// ==================== EQUIPMENT DETECTION ====================

const EQUIPMENT_KEYWORDS = {
  'oven': ['bake', 'roast', 'broil', 'oven', '°c', '°f', 'degrees'],
  'stovetop': ['pan', 'pot', 'saucepan', 'skillet', 'fry', 'sauté', 'saute', 'boil', 'simmer'],
  'blender': ['blend', 'blender', 'puree', 'purée', 'smooth'],
  'food processor': ['food processor', 'pulse', 'process until'],
  'mixer': ['mixer', 'whisk', 'beat', 'whip'],
  'grill': ['grill', 'barbecue', 'bbq', 'char'],
  'slow cooker': ['slow cooker', 'crock pot', 'crockpot'],
  'pressure cooker': ['pressure cooker', 'instant pot'],
  'microwave': ['microwave'],
  'wok': ['wok', 'stir fry', 'stir-fry'],
  'baking sheet': ['baking sheet', 'sheet pan', 'cookie sheet', 'baking tray'],
  'cast iron': ['cast iron', 'dutch oven'],
  'rolling pin': ['roll out', 'rolling pin', 'roll the dough'],
  'whisk': ['whisk'],
  'thermometer': ['temperature', 'thermometer', 'internal temp'],
  'strainer': ['strain', 'drain', 'colander'],
  'cutting board': ['chop', 'dice', 'mince', 'slice', 'cut'],
  'mixing bowls': ['bowl', 'combine', 'mix'],
}

const EQUIPMENT_ICONS = {
  'oven': '🔥',
  'stovetop': '🍳',
  'blender': '🫗',
  'food processor': '⚙️',
  'mixer': '🥄',
  'grill': '🔥',
  'slow cooker': '🥘',
  'pressure cooker': '♨️',
  'microwave': '📡',
  'wok': '🥘',
  'baking sheet': '🍪',
  'cast iron': '🍲',
  'rolling pin': '🪵',
  'whisk': '🥄',
  'thermometer': '🌡️',
  'strainer': '🥣',
  'cutting board': '🔪',
  'mixing bowls': '🥣',
}

export function detectEquipment(meal) {
  const instructions = (meal.strInstructions || '').toLowerCase()
  const equipment = []

  for (const [equip, keywords] of Object.entries(EQUIPMENT_KEYWORDS)) {
    if (keywords.some(kw => instructions.includes(kw))) {
      equipment.push({
        name: equip.charAt(0).toUpperCase() + equip.slice(1),
        icon: EQUIPMENT_ICONS[equip] || '🍴',
      })
    }
  }

  // Always include basic equipment if we have any instructions
  if (equipment.length === 0 && instructions.length > 0) {
    equipment.push({ name: 'Cutting Board', icon: '🔪' })
    equipment.push({ name: 'Mixing Bowls', icon: '🥣' })
  }

  return equipment
}

// ==================== CHEF TIPS ====================

const CHEF_TIPS_BY_CATEGORY = {
  'Beef': [
    'Let beef come to room temperature before cooking for more even results.',
    'Rest the meat for 5-10 minutes after cooking to let juices redistribute.',
    'Season generously with salt and pepper before searing.',
    'For tender results, cut against the grain when slicing.',
  ],
  'Chicken': [
    'Pat chicken dry with paper towels for crispier skin.',
    'Use a meat thermometer - chicken is done at 165°F (74°C) internal temp.',
    'Let chicken rest for 5 minutes before cutting.',
    'Pound chicken breasts to even thickness for uniform cooking.',
  ],
  'Lamb': [
    'Lamb pairs wonderfully with rosemary, mint, and garlic.',
    'Let lamb rest after cooking to ensure juicy results.',
    'For medium-rare lamb, aim for 145°F (63°C) internal temperature.',
    'Trim excess fat but leave a thin layer for flavor.',
  ],
  'Pork': [
    'Brine pork chops for 30 minutes for juicier results.',
    'Pork is safe at 145°F (63°C) - it can have a slight pink color.',
    'Score the fat on pork belly for crispier crackling.',
    'Let pork rest before slicing to retain moisture.',
  ],
  'Seafood': [
    'Fresh fish should smell like the ocean, not fishy.',
    'Don\'t overcook - fish is done when it flakes easily with a fork.',
    'Pat seafood dry before searing for better browning.',
    'Add acid (lemon/lime) at the end to brighten flavors.',
  ],
  'Pasta': [
    'Salt your pasta water generously - it should taste like the sea.',
    'Save a cup of pasta water before draining to adjust sauce consistency.',
    'Don\'t rinse pasta after cooking - the starch helps sauce adhere.',
    'Toss pasta with sauce in the pan, not on the plate.',
  ],
  'Vegetarian': [
    'Toast spices in dry pan to release more flavor.',
    'Don\'t crowd the pan when roasting vegetables.',
    'Season vegetables generously - they can handle more salt than you think.',
    'Add fresh herbs at the end to preserve their brightness.',
  ],
  'Vegan': [
    'Nutritional yeast adds a cheesy, umami flavor.',
    'Cashew cream makes an excellent dairy substitute.',
    'Roast vegetables at high heat for caramelization.',
    'Use coconut oil for richness in place of butter.',
  ],
  'Breakfast': [
    'Use room temperature eggs for fluffier omelets.',
    'Let pancake batter rest for 5 minutes for tender results.',
    'Low and slow is the key to perfectly scrambled eggs.',
    'Preheat your pan properly before adding eggs.',
  ],
  'Dessert': [
    'Measure ingredients precisely - baking is a science.',
    'Bring eggs and butter to room temperature before mixing.',
    'Don\'t overmix batter - it leads to tough results.',
    'Chill cookie dough for better texture and flavor.',
  ],
  'Side': [
    'Blanch vegetables in salted water, then ice bath for vibrant color.',
    'Roast vegetables at 425°F (220°C) for best caramelization.',
    'Add acid (vinegar/citrus) to brighten heavy dishes.',
    'Season in layers throughout cooking, not just at the end.',
  ],
  'Starter': [
    'Serve appetizers at the right temperature for best flavor.',
    'Keep portions small - they should whet the appetite.',
    'Balance rich starters with acidic elements.',
    'Prepare components ahead and assemble just before serving.',
  ],
}

export function getChefTips(meal) {
  const category = meal.strCategory || 'Miscellaneous'
  const tips = CHEF_TIPS_BY_CATEGORY[category] || CHEF_TIPS_BY_CATEGORY['Vegetarian']

  // Return 2-3 relevant tips
  return tips.slice(0, 3)
}

// ==================== WINE PAIRINGS ====================

const WINE_PAIRINGS = {
  'Beef': [
    { wine: 'Cabernet Sauvignon', description: 'Bold and tannic, perfect for rich beef dishes', type: 'red' },
    { wine: 'Malbec', description: 'Fruity with soft tannins, great with grilled beef', type: 'red' },
    { wine: 'Syrah/Shiraz', description: 'Spicy and full-bodied, pairs well with stews', type: 'red' },
  ],
  'Chicken': [
    { wine: 'Chardonnay', description: 'Creamy texture complements roasted chicken', type: 'white' },
    { wine: 'Pinot Noir', description: 'Light red that won\'t overpower poultry', type: 'red' },
    { wine: 'Sauvignon Blanc', description: 'Crisp acidity for lighter chicken dishes', type: 'white' },
  ],
  'Lamb': [
    { wine: 'Bordeaux Blend', description: 'Classic pairing with lamb', type: 'red' },
    { wine: 'Rioja', description: 'Spanish red with earthy notes', type: 'red' },
    { wine: 'Côtes du Rhône', description: 'Herbaceous notes match lamb beautifully', type: 'red' },
  ],
  'Pork': [
    { wine: 'Riesling', description: 'Slight sweetness balances savory pork', type: 'white' },
    { wine: 'Pinot Grigio', description: 'Light and refreshing with pork chops', type: 'white' },
    { wine: 'Zinfandel', description: 'Fruity red for BBQ pork', type: 'red' },
  ],
  'Seafood': [
    { wine: 'Muscadet', description: 'Mineral notes perfect with shellfish', type: 'white' },
    { wine: 'Albariño', description: 'Crisp Spanish white for seafood', type: 'white' },
    { wine: 'Champagne', description: 'Bubbles and brine are a classic match', type: 'sparkling' },
  ],
  'Pasta': [
    { wine: 'Chianti', description: 'Italian classic for tomato-based pasta', type: 'red' },
    { wine: 'Pinot Grigio', description: 'Light white for cream sauces', type: 'white' },
    { wine: 'Barbera', description: 'High acidity balances rich pasta dishes', type: 'red' },
  ],
  'Vegetarian': [
    { wine: 'Grüner Veltliner', description: 'Herbal notes complement vegetables', type: 'white' },
    { wine: 'Beaujolais', description: 'Light red that won\'t overpower veggies', type: 'red' },
    { wine: 'Rosé', description: 'Versatile choice for vegetable dishes', type: 'rosé' },
  ],
  'Vegan': [
    { wine: 'Verdejo', description: 'Bright acidity for plant-based dishes', type: 'white' },
    { wine: 'Côtes de Provence Rosé', description: 'Refreshing with Mediterranean flavors', type: 'rosé' },
    { wine: 'Natural Orange Wine', description: 'Complex pairing for bold vegan dishes', type: 'orange' },
  ],
  'Dessert': [
    { wine: 'Moscato d\'Asti', description: 'Light bubbles with fruit desserts', type: 'sparkling' },
    { wine: 'Port', description: 'Rich and sweet for chocolate desserts', type: 'fortified' },
    { wine: 'Sauternes', description: 'Honey notes with pastries', type: 'dessert' },
  ],
  'Starter': [
    { wine: 'Prosecco', description: 'Light bubbles to start the meal', type: 'sparkling' },
    { wine: 'Chablis', description: 'Crisp and clean for appetizers', type: 'white' },
    { wine: 'Sherry', description: 'Nutty flavors for Spanish tapas', type: 'fortified' },
  ],
}

export function getWinePairings(meal) {
  const category = meal.strCategory || 'Miscellaneous'
  return WINE_PAIRINGS[category] || WINE_PAIRINGS['Vegetarian']
}

// ==================== SIDE DISH RECOMMENDATIONS ====================

const SIDE_DISHES = {
  'Beef': [
    { name: 'Roasted Potatoes', description: 'Crispy on outside, fluffy inside', icon: '🥔' },
    { name: 'Creamed Spinach', description: 'Rich and indulgent classic', icon: '🥬' },
    { name: 'Grilled Asparagus', description: 'Light vegetable balance', icon: '🌿' },
    { name: 'Caesar Salad', description: 'Fresh crunch to cut richness', icon: '🥗' },
  ],
  'Chicken': [
    { name: 'Mashed Potatoes', description: 'Comfort food classic', icon: '🥔' },
    { name: 'Roasted Vegetables', description: 'Colorful and healthy', icon: '🥕' },
    { name: 'Rice Pilaf', description: 'Fluffy and aromatic', icon: '🍚' },
    { name: 'Green Beans', description: 'Simple and elegant', icon: '🫛' },
  ],
  'Lamb': [
    { name: 'Couscous', description: 'North African classic pairing', icon: '🫘' },
    { name: 'Mint Peas', description: 'Fresh and traditional', icon: '🟢' },
    { name: 'Roasted Root Vegetables', description: 'Earthy complement', icon: '🥕' },
    { name: 'Greek Salad', description: 'Mediterranean freshness', icon: '🥗' },
  ],
  'Pork': [
    { name: 'Apple Sauce', description: 'Sweet and tangy classic', icon: '🍎' },
    { name: 'Coleslaw', description: 'Crunchy and refreshing', icon: '🥬' },
    { name: 'Baked Beans', description: 'Hearty BBQ companion', icon: '🫘' },
    { name: 'Corn on the Cob', description: 'Summer favorite', icon: '🌽' },
  ],
  'Seafood': [
    { name: 'Lemon Rice', description: 'Bright and zesty', icon: '🍋' },
    { name: 'Steamed Vegetables', description: 'Light and healthy', icon: '🥦' },
    { name: 'Garlic Bread', description: 'Crispy and aromatic', icon: '🍞' },
    { name: 'Mixed Salad', description: 'Fresh and simple', icon: '🥗' },
  ],
  'Pasta': [
    { name: 'Garlic Bread', description: 'Italian restaurant classic', icon: '🍞' },
    { name: 'Caprese Salad', description: 'Fresh tomato and mozzarella', icon: '🍅' },
    { name: 'Bruschetta', description: 'Toasted bread with toppings', icon: '🥖' },
    { name: 'Minestrone Soup', description: 'Hearty Italian starter', icon: '🥣' },
  ],
  'Vegetarian': [
    { name: 'Quinoa Salad', description: 'Protein-rich grain bowl', icon: '🥗' },
    { name: 'Hummus & Pita', description: 'Mediterranean snack', icon: '🫓' },
    { name: 'Roasted Cauliflower', description: 'Caramelized and nutty', icon: '🥬' },
    { name: 'Sweet Potato Fries', description: 'Healthier alternative', icon: '🍠' },
  ],
  'Vegan': [
    { name: 'Avocado Toast', description: 'Trendy and nutritious', icon: '🥑' },
    { name: 'Edamame', description: 'Protein-packed beans', icon: '🫛' },
    { name: 'Kale Chips', description: 'Crispy superfood snack', icon: '🥬' },
    { name: 'Coconut Rice', description: 'Creamy and fragrant', icon: '🥥' },
  ],
  'Breakfast': [
    { name: 'Fresh Fruit', description: 'Seasonal and refreshing', icon: '🍓' },
    { name: 'Hash Browns', description: 'Crispy potato goodness', icon: '🥔' },
    { name: 'Toast & Jam', description: 'Simple classic', icon: '🍞' },
    { name: 'Yogurt Parfait', description: 'Layered with granola', icon: '🥣' },
  ],
  'Dessert': [
    { name: 'Fresh Berries', description: 'Light and natural', icon: '🍓' },
    { name: 'Whipped Cream', description: 'Classic topping', icon: '🍦' },
    { name: 'Vanilla Ice Cream', description: 'Perfect complement', icon: '🍨' },
    { name: 'Coffee', description: 'After-dinner digestif', icon: '☕' },
  ],
}

export function getSideDishes(meal) {
  const category = meal.strCategory || 'Miscellaneous'
  return SIDE_DISHES[category] || SIDE_DISHES['Vegetarian']
}

// ==================== AREA/CUISINE INFO ====================

const CUISINE_INFO = {
  'American': { flag: '🇺🇸', description: 'Classic American comfort food' },
  'British': { flag: '🇬🇧', description: 'Traditional British cuisine' },
  'Canadian': { flag: '🇨🇦', description: 'Canadian culinary traditions' },
  'Chinese': { flag: '🇨🇳', description: 'Rich flavors from China' },
  'Croatian': { flag: '🇭🇷', description: 'Mediterranean Croatian dishes' },
  'Dutch': { flag: '🇳🇱', description: 'Hearty Dutch cooking' },
  'Egyptian': { flag: '🇪🇬', description: 'Ancient Egyptian flavors' },
  'Filipino': { flag: '🇵🇭', description: 'Filipino home cooking' },
  'French': { flag: '🇫🇷', description: 'Classic French cuisine' },
  'Greek': { flag: '🇬🇷', description: 'Mediterranean Greek flavors' },
  'Indian': { flag: '🇮🇳', description: 'Aromatic Indian spices' },
  'Irish': { flag: '🇮🇪', description: 'Traditional Irish comfort food' },
  'Italian': { flag: '🇮🇹', description: 'Authentic Italian cooking' },
  'Jamaican': { flag: '🇯🇲', description: 'Bold Jamaican flavors' },
  'Japanese': { flag: '🇯🇵', description: 'Japanese culinary art' },
  'Kenyan': { flag: '🇰🇪', description: 'East African cuisine' },
  'Malaysian': { flag: '🇲🇾', description: 'Malaysian fusion flavors' },
  'Mexican': { flag: '🇲🇽', description: 'Vibrant Mexican cuisine' },
  'Moroccan': { flag: '🇲🇦', description: 'North African spices' },
  'Polish': { flag: '🇵🇱', description: 'Hearty Polish dishes' },
  'Portuguese': { flag: '🇵🇹', description: 'Portuguese coastal cuisine' },
  'Russian': { flag: '🇷🇺', description: 'Traditional Russian fare' },
  'Spanish': { flag: '🇪🇸', description: 'Spanish tapas and paella' },
  'Thai': { flag: '🇹🇭', description: 'Thai balance of flavors' },
  'Tunisian': { flag: '🇹🇳', description: 'North African spices' },
  'Turkish': { flag: '🇹🇷', description: 'Turkish culinary heritage' },
  'Vietnamese': { flag: '🇻🇳', description: 'Fresh Vietnamese cuisine' },
  'Unknown': { flag: '🌍', description: 'International cuisine' },
}

export function getCuisineInfo(area) {
  return CUISINE_INFO[area] || CUISINE_INFO['Unknown']
}

// ==================== MAIN ENHANCEMENT FUNCTION ====================

export function getRecipeEnhancements(meal) {
  return {
    times: estimateTimes(meal),
    difficulty: estimateDifficulty(meal),
    servings: estimateServings(meal),
    dietaryTags: detectDietaryTags(meal),
    equipment: detectEquipment(meal),
    chefTips: getChefTips(meal),
    winePairings: getWinePairings(meal),
    sideDishes: getSideDishes(meal),
    cuisineInfo: getCuisineInfo(meal.strArea),
  }
}
