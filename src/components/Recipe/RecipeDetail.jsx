import { useState, useEffect, useRef, useCallback } from 'react'
import { DAYS, MEAL_SLOTS } from '../../context/AppContext'
import { useOfflineActions } from '../../hooks/useOfflineActions'
import { extractIngredients, getYouTubeEmbedUrl, estimateCookingTime, estimateDifficulty, estimateServings, countIngredients, filterByIngredient } from '../../api/mealdb'
import CookingMode from './CookingMode'
import RecipeEnhancementsPanel from './RecipeEnhancementsPanel'
import { detectAllergens, ALLERGENS, getDietaryBadges, DIETARY_TYPES } from '../../data/dietaryData'
import ProgressiveImage from '../ui/ProgressiveImage'

// Slot configuration for meal plan modal
const SLOT_CONFIG = {
  breakfast: { label: 'Breakfast', icon: '🌅' },
  lunch: { label: 'Lunch', icon: '☀️' },
  dinner: { label: 'Dinner', icon: '🌙' },
  snacks: { label: 'Snacks', icon: '🍿' },
  dessert: { label: 'Dessert', icon: '🍰' },
}

// Ingredient icons mapping
const INGREDIENT_ICONS = {
  // Proteins
  egg: '🥚', eggs: '🥚', chicken: '🍗', beef: '🥩', pork: '🥓', bacon: '🥓',
  fish: '🐟', salmon: '🐟', tuna: '🐟', shrimp: '🦐', prawns: '🦐',
  lamb: '🍖', turkey: '🦃', duck: '🦆', sausage: '🌭',
  // Dairy
  butter: '🧈', milk: '🥛', cream: '🥛', cheese: '🧀', parmesan: '🧀',
  mozzarella: '🧀', cheddar: '🧀', yogurt: '🥛', yoghurt: '🥛',
  // Vegetables
  onion: '🧅', onions: '🧅', garlic: '🧄', tomato: '🍅', tomatoes: '🍅',
  potato: '🥔', potatoes: '🥔', carrot: '🥕', carrots: '🥕',
  pepper: '🫑', peppers: '🫑', chili: '🌶️', chilli: '🌶️',
  mushroom: '🍄', mushrooms: '🍄', corn: '🌽', broccoli: '🥦',
  lettuce: '🥬', spinach: '🥬', cucumber: '🥒', avocado: '🥑',
  eggplant: '🍆', aubergine: '🍆', celery: '🥬', cabbage: '🥬',
  // Fruits
  lemon: '🍋', lime: '🍋', orange: '🍊', apple: '🍎', banana: '🍌',
  strawberry: '🍓', strawberries: '🍓', grape: '🍇', grapes: '🍇',
  coconut: '🥥', pineapple: '🍍', mango: '🥭', peach: '🍑',
  // Grains & Bread
  bread: '🍞', flour: '🌾', rice: '🍚', pasta: '🍝', noodles: '🍜',
  oats: '🌾', wheat: '🌾',
  // Seasonings & Condiments
  salt: '🧂', honey: '🍯', oil: '🫒', 'olive oil': '🫒',
  vinegar: '🫙', sugar: '🍬', chocolate: '🍫', cocoa: '🍫',
  // Herbs
  basil: '🌿', parsley: '🌿', cilantro: '🌿', coriander: '🌿',
  mint: '🌿', thyme: '🌿', rosemary: '🌿', oregano: '🌿',
  // Nuts
  almond: '🥜', almonds: '🥜', peanut: '🥜', peanuts: '🥜',
  walnut: '🥜', walnuts: '🥜', cashew: '🥜', cashews: '🥜',
  // Beverages
  wine: '🍷', beer: '🍺', coffee: '☕', tea: '🍵', water: '💧',
}

// Get icon for ingredient
const getIngredientIcon = (ingredient) => {
  const lower = ingredient.toLowerCase()
  for (const [key, icon] of Object.entries(INGREDIENT_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '•'
}

// Ingredient substitutions database
const SUBSTITUTIONS = {
  // Dairy
  'heavy cream': {
    subs: ['coconut cream', 'Greek yogurt + milk', 'evaporated milk', 'cashew cream', 'silken tofu blended'],
    notes: 'For cooking, not whipping',
    ratio: '1:1'
  },
  'cream': {
    subs: ['coconut cream', 'cashew cream', 'oat cream', 'evaporated milk'],
    notes: 'Results may vary in richness',
    ratio: '1:1'
  },
  'milk': {
    subs: ['oat milk', 'almond milk', 'soy milk', 'coconut milk', 'cashew milk'],
    notes: 'Unsweetened for savory dishes',
    ratio: '1:1'
  },
  'butter': {
    subs: ['coconut oil', 'olive oil', 'ghee', 'vegetable oil', 'applesauce (baking)', 'mashed banana (baking)'],
    notes: 'Oil: use ¾ amount',
    ratio: '1:¾ for oils'
  },
  'buttermilk': {
    subs: ['milk + lemon juice', 'milk + vinegar', 'plain yogurt + milk', 'sour cream + milk'],
    notes: 'Add 1 tbsp acid per cup milk, let sit 5 min',
    ratio: '1:1'
  },
  'sour cream': {
    subs: ['Greek yogurt', 'cottage cheese blended', 'coconut cream + lemon', 'crème fraîche'],
    notes: 'Greek yogurt is closest match',
    ratio: '1:1'
  },
  'yogurt': {
    subs: ['sour cream', 'buttermilk', 'coconut yogurt', 'silken tofu blended'],
    notes: 'Match thickness as needed',
    ratio: '1:1'
  },
  'cheese': {
    subs: ['nutritional yeast', 'cashew cheese', 'tofu ricotta', 'vegan cheese'],
    notes: 'Flavor profiles vary significantly',
    ratio: 'To taste'
  },
  'parmesan': {
    subs: ['nutritional yeast', 'pecorino romano', 'asiago', 'aged white cheddar', 'vegan parmesan'],
    notes: 'Nutritional yeast for vegan option',
    ratio: '1:1'
  },
  'mozzarella': {
    subs: ['provolone', 'white cheddar', 'Monterey Jack', 'vegan mozzarella'],
    notes: 'Melting properties vary',
    ratio: '1:1'
  },
  'ricotta': {
    subs: ['cottage cheese', 'tofu crumbled', 'mascarpone', 'cream cheese'],
    notes: 'Blend cottage cheese for smooth texture',
    ratio: '1:1'
  },
  // Eggs
  'egg': {
    subs: ['flax egg (1 tbsp ground flax + 3 tbsp water)', 'chia egg', 'mashed banana (¼ cup)', 'applesauce (¼ cup)', 'silken tofu (¼ cup)', 'aquafaba (3 tbsp)'],
    notes: 'Flax/chia: let sit 5 min to gel',
    ratio: '1 egg = 1 substitute'
  },
  'eggs': {
    subs: ['flax eggs', 'chia eggs', 'mashed banana', 'applesauce', 'silken tofu', 'aquafaba'],
    notes: 'See egg substitute ratios',
    ratio: 'Per egg basis'
  },
  // Flour & Grains
  'flour': {
    subs: ['almond flour', 'oat flour', 'coconut flour (use ¼)', 'rice flour', 'gluten-free blend'],
    notes: 'Coconut flour absorbs more liquid',
    ratio: '1:1 except coconut (1:¼)'
  },
  'all-purpose flour': {
    subs: ['whole wheat flour', 'bread flour', 'gluten-free flour blend', 'oat flour'],
    notes: 'Whole wheat may need more liquid',
    ratio: '1:1'
  },
  'breadcrumbs': {
    subs: ['crushed crackers', 'panko', 'oats', 'crushed cornflakes', 'almond meal'],
    notes: 'Toast for better crunch',
    ratio: '1:1'
  },
  'pasta': {
    subs: ['zucchini noodles', 'spaghetti squash', 'rice noodles', 'quinoa pasta', 'lentil pasta'],
    notes: 'Cook times vary',
    ratio: '1:1'
  },
  'rice': {
    subs: ['quinoa', 'cauliflower rice', 'bulgur', 'couscous', 'farro', 'barley'],
    notes: 'Adjust cooking liquid as needed',
    ratio: '1:1'
  },
  // Proteins
  'chicken': {
    subs: ['tofu', 'seitan', 'tempeh', 'jackfruit', 'turkey', 'chickpeas'],
    notes: 'Press tofu for better texture',
    ratio: '1:1 by weight'
  },
  'beef': {
    subs: ['mushrooms (portobello)', 'lentils', 'tempeh', 'seitan', 'beyond meat', 'jackfruit'],
    notes: 'Mushrooms give umami depth',
    ratio: '1:1 by weight'
  },
  'ground beef': {
    subs: ['ground turkey', 'lentils', 'crumbled tofu', 'TVP', 'mushroom crumbles', 'plant-based ground'],
    notes: 'Brown lentils work best',
    ratio: '1:1'
  },
  'bacon': {
    subs: ['tempeh bacon', 'coconut bacon', 'mushroom bacon', 'smoked paprika + soy sauce', 'turkey bacon'],
    notes: 'Add liquid smoke for flavor',
    ratio: '1:1'
  },
  'fish': {
    subs: ['tofu (firm)', 'hearts of palm', 'banana blossom', 'chickpeas mashed', 'jackfruit'],
    notes: 'Add nori for seafood flavor',
    ratio: '1:1'
  },
  // Sweeteners
  'sugar': {
    subs: ['honey', 'maple syrup', 'coconut sugar', 'stevia', 'monk fruit', 'agave'],
    notes: 'Liquid sweeteners: reduce other liquids',
    ratio: '1:¾ for liquid sweeteners'
  },
  'brown sugar': {
    subs: ['white sugar + molasses', 'coconut sugar', 'maple sugar', 'date sugar'],
    notes: '1 tbsp molasses per cup white sugar',
    ratio: '1:1'
  },
  'honey': {
    subs: ['maple syrup', 'agave nectar', 'date syrup', 'brown rice syrup', 'molasses'],
    notes: 'Maple syrup is closest vegan option',
    ratio: '1:1'
  },
  // Oils & Fats
  'olive oil': {
    subs: ['avocado oil', 'grapeseed oil', 'vegetable oil', 'coconut oil', 'butter'],
    notes: 'Avocado oil for high heat',
    ratio: '1:1'
  },
  'vegetable oil': {
    subs: ['canola oil', 'sunflower oil', 'coconut oil', 'olive oil', 'applesauce (baking)'],
    notes: 'Match smoke points for frying',
    ratio: '1:1'
  },
  'coconut oil': {
    subs: ['butter', 'vegetable oil', 'olive oil', 'avocado oil'],
    notes: 'Solid coconut oil = butter',
    ratio: '1:1'
  },
  // Acids & Vinegars
  'lemon juice': {
    subs: ['lime juice', 'white wine vinegar', 'apple cider vinegar', 'orange juice'],
    notes: 'Start with less, adjust to taste',
    ratio: '1:1'
  },
  'vinegar': {
    subs: ['lemon juice', 'lime juice', 'white wine', 'apple cider vinegar'],
    notes: 'Acidity levels vary',
    ratio: '1:1'
  },
  'wine': {
    subs: ['broth + vinegar', 'grape juice + vinegar', 'non-alcoholic wine', 'apple juice (white wine)'],
    notes: 'Add splash of vinegar for depth',
    ratio: '1:1'
  },
  'white wine': {
    subs: ['chicken broth + lemon', 'white grape juice + vinegar', 'apple cider vinegar diluted', 'vermouth'],
    notes: 'Broth works well in savory dishes',
    ratio: '1:1'
  },
  'red wine': {
    subs: ['beef broth + vinegar', 'grape juice + vinegar', 'cranberry juice', 'pomegranate juice'],
    notes: 'Add balsamic for depth',
    ratio: '1:1'
  },
  // Condiments & Sauces
  'soy sauce': {
    subs: ['tamari', 'coconut aminos', 'liquid aminos', 'Worcestershire sauce', 'fish sauce diluted'],
    notes: 'Coconut aminos is sweeter, use more',
    ratio: '1:1'
  },
  'fish sauce': {
    subs: ['soy sauce + lime', 'coconut aminos + seaweed', 'Worcestershire sauce', 'miso paste diluted'],
    notes: 'Add a pinch of sugar',
    ratio: '1:1'
  },
  'mayonnaise': {
    subs: ['Greek yogurt', 'mashed avocado', 'hummus', 'silken tofu blended', 'vegan mayo'],
    notes: 'Greek yogurt for lighter option',
    ratio: '1:1'
  },
  'mustard': {
    subs: ['horseradish', 'wasabi (less amount)', 'turmeric + vinegar', 'mayonnaise + turmeric'],
    notes: 'Adjust heat level carefully',
    ratio: '1:1'
  },
  'tomato paste': {
    subs: ['tomato sauce (reduce)', 'ketchup', 'sun-dried tomatoes blended', 'fresh tomatoes cooked down'],
    notes: 'Use 3x tomato sauce, reduce liquid',
    ratio: '1 tbsp paste = 3 tbsp sauce'
  },
  // Herbs & Spices
  'fresh herbs': {
    subs: ['dried herbs (use ⅓ amount)', 'herb paste', 'frozen herbs'],
    notes: 'Add dried herbs earlier in cooking',
    ratio: '1 tbsp fresh = 1 tsp dried'
  },
  'basil': {
    subs: ['oregano', 'thyme', 'Italian seasoning', 'spinach + mint'],
    notes: 'Add at end for fresh flavor',
    ratio: '1:1'
  },
  'cilantro': {
    subs: ['parsley', 'Thai basil', 'dill', 'mint', 'celery leaves'],
    notes: 'Parsley for cilantro-averse',
    ratio: '1:1'
  },
  'parsley': {
    subs: ['cilantro', 'chervil', 'celery leaves', 'arugula'],
    notes: 'Use fresh when possible',
    ratio: '1:1'
  },
  'garlic': {
    subs: ['garlic powder (¼ tsp per clove)', 'shallots', 'garlic-infused oil', 'chives'],
    notes: 'Fresh garlic has stronger flavor',
    ratio: '1 clove = ¼ tsp powder'
  },
  'onion': {
    subs: ['shallots', 'leeks', 'scallions', 'onion powder', 'celery'],
    notes: '1 tbsp powder = 1 medium onion',
    ratio: '1:1 for fresh alternatives'
  },
  'ginger': {
    subs: ['ground ginger (¼ tsp per tbsp fresh)', 'galangal', 'turmeric + cardamom', 'lemongrass'],
    notes: 'Ground ginger is more concentrated',
    ratio: '1 tbsp fresh = ¼ tsp ground'
  },
  // Nuts & Seeds
  'almonds': {
    subs: ['cashews', 'pecans', 'walnuts', 'sunflower seeds', 'pumpkin seeds'],
    notes: 'Seeds for nut-free option',
    ratio: '1:1'
  },
  'peanuts': {
    subs: ['almonds', 'cashews', 'sunflower seeds', 'soy nuts'],
    notes: 'Sunflower butter for allergies',
    ratio: '1:1'
  },
  'peanut butter': {
    subs: ['almond butter', 'sunflower seed butter', 'cashew butter', 'tahini', 'soy nut butter'],
    notes: 'Tahini adds different flavor profile',
    ratio: '1:1'
  },
  // Thickeners
  'cornstarch': {
    subs: ['arrowroot powder', 'tapioca starch', 'potato starch', 'flour (use 2x)', 'rice flour'],
    notes: 'Arrowroot for glossy sauces',
    ratio: '1:1 for starches, 1:2 for flour'
  },
  'gelatin': {
    subs: ['agar-agar', 'pectin', 'carrageenan', 'cornstarch'],
    notes: 'Agar sets firmer, use less',
    ratio: '1 tsp gelatin = ½ tsp agar'
  }
}

// Find substitutes for an ingredient
const findSubstitutes = (ingredient) => {
  const lower = ingredient.toLowerCase().trim()

  // Direct match first
  if (SUBSTITUTIONS[lower]) {
    return { ingredient: lower, ...SUBSTITUTIONS[lower] }
  }

  // Partial match
  for (const [key, value] of Object.entries(SUBSTITUTIONS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { ingredient: key, ...value }
    }
  }

  return null
}

// Common leftover ingredients - items that typically come in larger quantities than recipes need
const LEFTOVER_INGREDIENTS = {
  // Fresh herbs (usually sold in bunches)
  'cilantro': { icon: '🌿', shelfLife: '1 week', storage: 'Wrap in damp paper towel, refrigerate' },
  'parsley': { icon: '🌿', shelfLife: '1-2 weeks', storage: 'Treat like flowers in water, refrigerate' },
  'basil': { icon: '🌿', shelfLife: '5-7 days', storage: 'Store at room temp in water, not fridge' },
  'mint': { icon: '🌿', shelfLife: '1 week', storage: 'Wrap in damp paper towel, refrigerate' },
  'dill': { icon: '🌿', shelfLife: '1 week', storage: 'Wrap in damp paper towel, refrigerate' },
  'rosemary': { icon: '🌿', shelfLife: '2 weeks', storage: 'Wrap loosely, refrigerate' },
  'thyme': { icon: '🌿', shelfLife: '2 weeks', storage: 'Wrap loosely, refrigerate' },
  'chives': { icon: '🌿', shelfLife: '1 week', storage: 'Wrap in damp paper towel, refrigerate' },

  // Proteins (often sold in larger portions)
  'chicken': { icon: '🍗', shelfLife: '3-4 days cooked', storage: 'Refrigerate in airtight container' },
  'chicken breast': { icon: '🍗', shelfLife: '3-4 days cooked', storage: 'Refrigerate in airtight container' },
  'ground beef': { icon: '🥩', shelfLife: '3-4 days cooked', storage: 'Refrigerate in airtight container' },
  'bacon': { icon: '🥓', shelfLife: '1 week opened', storage: 'Wrap tightly, refrigerate' },
  'ham': { icon: '🍖', shelfLife: '3-5 days', storage: 'Wrap tightly, refrigerate' },

  // Dairy
  'heavy cream': { icon: '🥛', shelfLife: '1 week opened', storage: 'Keep cold, use quickly once opened' },
  'sour cream': { icon: '🥛', shelfLife: '2 weeks opened', storage: 'Keep refrigerated' },
  'buttermilk': { icon: '🥛', shelfLife: '2 weeks', storage: 'Keep refrigerated' },
  'cream cheese': { icon: '🧀', shelfLife: '2 weeks opened', storage: 'Keep refrigerated, wrapped' },
  'ricotta': { icon: '🧀', shelfLife: '1 week opened', storage: 'Keep refrigerated' },
  'feta': { icon: '🧀', shelfLife: '1 week opened', storage: 'Store in brine, refrigerate' },
  'goat cheese': { icon: '🧀', shelfLife: '2 weeks', storage: 'Wrap tightly, refrigerate' },

  // Vegetables (often sold in bunches/larger quantities)
  'celery': { icon: '🥬', shelfLife: '2 weeks', storage: 'Wrap in foil, refrigerate' },
  'green onions': { icon: '🧅', shelfLife: '1 week', storage: 'Stand in water, refrigerate' },
  'scallions': { icon: '🧅', shelfLife: '1 week', storage: 'Stand in water, refrigerate' },
  'leeks': { icon: '🧅', shelfLife: '2 weeks', storage: 'Wrap loosely, refrigerate' },
  'ginger': { icon: '🫚', shelfLife: '3 weeks', storage: 'Refrigerate unpeeled, or freeze' },
  'lemongrass': { icon: '🌿', shelfLife: '2 weeks', storage: 'Wrap in plastic, refrigerate' },
  'jalapeño': { icon: '🌶️', shelfLife: '1 week', storage: 'Refrigerate in produce drawer' },
  'serrano': { icon: '🌶️', shelfLife: '1 week', storage: 'Refrigerate in produce drawer' },
  'bell pepper': { icon: '🫑', shelfLife: '1-2 weeks', storage: 'Refrigerate in produce drawer' },

  // Citrus (often only need juice/zest)
  'lemon': { icon: '🍋', shelfLife: '2-3 weeks', storage: 'Refrigerate for longer life' },
  'lime': { icon: '🍋', shelfLife: '2-3 weeks', storage: 'Refrigerate for longer life' },
  'orange': { icon: '🍊', shelfLife: '2-3 weeks', storage: 'Refrigerate for longer life' },

  // Canned/Jarred (once opened)
  'coconut milk': { icon: '🥥', shelfLife: '4-5 days opened', storage: 'Transfer to container, refrigerate' },
  'tomato paste': { icon: '🍅', shelfLife: '1 week opened', storage: 'Cover with oil, refrigerate' },
  'chipotle': { icon: '🌶️', shelfLife: '2 weeks opened', storage: 'Transfer to container, refrigerate' },
  'chipotles in adobo': { icon: '🌶️', shelfLife: '2 weeks opened', storage: 'Transfer to container, refrigerate' },
  'tahini': { icon: '🥜', shelfLife: '6 months opened', storage: 'Refrigerate after opening' },
  'fish sauce': { icon: '🐟', shelfLife: '2-3 years', storage: 'Refrigerate after opening' },
  'oyster sauce': { icon: '🦪', shelfLife: '6 months opened', storage: 'Refrigerate after opening' },
  'hoisin sauce': { icon: '🥡', shelfLife: '6 months opened', storage: 'Refrigerate after opening' },

  // Wine/Alcohol
  'white wine': { icon: '🍷', shelfLife: '3-5 days opened', storage: 'Cork and refrigerate' },
  'red wine': { icon: '🍷', shelfLife: '3-5 days opened', storage: 'Cork and store cool' },
  'sherry': { icon: '🍷', shelfLife: '1-3 weeks opened', storage: 'Refrigerate after opening' },

  // Other common leftovers
  'breadcrumbs': { icon: '🍞', shelfLife: '6 months', storage: 'Store in airtight container' },
  'panko': { icon: '🍞', shelfLife: '6 months', storage: 'Store in airtight container' },
  'stock': { icon: '🍲', shelfLife: '4-5 days opened', storage: 'Refrigerate, or freeze in portions' },
  'broth': { icon: '🍲', shelfLife: '4-5 days opened', storage: 'Refrigerate, or freeze in portions' },
  'pesto': { icon: '🌿', shelfLife: '1 week opened', storage: 'Cover with oil, refrigerate' },
}

// Detect potential leftover ingredients from a recipe
const detectLeftovers = (ingredients) => {
  const leftovers = []

  for (const item of ingredients) {
    const ingredientLower = item.ingredient.toLowerCase()

    for (const [leftoverKey, leftoverInfo] of Object.entries(LEFTOVER_INGREDIENTS)) {
      if (ingredientLower.includes(leftoverKey) || leftoverKey.includes(ingredientLower)) {
        // Check if already added (avoid duplicates)
        if (!leftovers.find(l => l.key === leftoverKey)) {
          leftovers.push({
            key: leftoverKey,
            name: item.ingredient,
            ...leftoverInfo
          })
        }
        break
      }
    }
  }

  return leftovers
}

// Dietary tag detection and styling
const DIETARY_TAGS = {
  vegetarian: { label: 'Vegetarian', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', icon: '🥬' },
  vegan: { label: 'Vegan', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300', icon: '🌱' },
  'gluten-free': { label: 'Gluten-Free', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300', icon: '🌾' },
  'dairy-free': { label: 'Dairy-Free', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', icon: '🥛' },
  'low-carb': { label: 'Low-Carb', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300', icon: '📉' },
  keto: { label: 'Keto', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', icon: '🥑' },
  'high-protein': { label: 'High-Protein', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', icon: '💪' },
  quick: { label: 'Quick Meal', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', icon: '⚡' },
  healthy: { label: 'Healthy', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300', icon: '💚' },
}

// Detect dietary tags from meal data
const detectDietaryTags = (meal, ingredients) => {
  const tags = []
  const category = meal?.strCategory?.toLowerCase() || ''
  const allTags = meal?.strTags?.toLowerCase() || ''
  const ingredientList = ingredients.map(i => i.ingredient.toLowerCase()).join(' ')

  // Check category and tags
  if (category.includes('vegetarian') || allTags.includes('vegetarian')) {
    tags.push('vegetarian')
  }
  if (category.includes('vegan') || allTags.includes('vegan')) {
    tags.push('vegan')
  }

  // Check for meat-free (potential vegetarian)
  const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage', 'turkey', 'duck', 'meat']
  const hasMeat = meatKeywords.some(meat => ingredientList.includes(meat))
  if (!hasMeat && !tags.includes('vegetarian') && category !== 'seafood') {
    tags.push('vegetarian')
  }

  // Check for dairy-free
  const dairyKeywords = ['milk', 'cream', 'cheese', 'butter', 'yogurt', 'yoghurt']
  const hasDairy = dairyKeywords.some(dairy => ingredientList.includes(dairy))
  if (!hasDairy) {
    tags.push('dairy-free')
  }

  // Check for gluten indicators
  const glutenKeywords = ['flour', 'bread', 'pasta', 'noodles', 'soy sauce', 'breadcrumbs']
  const hasGluten = glutenKeywords.some(gluten => ingredientList.includes(gluten))
  if (!hasGluten) {
    tags.push('gluten-free')
  }

  // High protein categories
  if (['beef', 'chicken', 'lamb', 'pork', 'seafood'].includes(category)) {
    tags.push('high-protein')
  }

  // Quick meal based on cooking time
  const cookTime = estimateCookingTime(meal)
  if (cookTime && cookTime <= 20) {
    tags.push('quick')
  }

  // Check tags for other dietary info
  if (allTags.includes('healthy') || allTags.includes('light')) {
    tags.push('healthy')
  }

  return tags.slice(0, 4) // Limit to 4 tags
}

// Parse instructions into numbered steps
const parseInstructionsToSteps = (instructions) => {
  if (!instructions) return []

  // Split by common patterns
  let steps = instructions
    .split(/(?:\r?\n)+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  // If we only got one big block, try splitting by sentences that start with action verbs
  if (steps.length <= 2) {
    const singleBlock = instructions.replace(/\r?\n/g, ' ')
    // Split on periods followed by capital letters (new sentences)
    steps = singleBlock
      .split(/\.(?=\s+[A-Z])/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .map(s => s.endsWith('.') ? s : s + '.')
  }

  // Remove step numbers if they already exist
  steps = steps.map(step => step.replace(/^(?:step\s*)?\d+[\.\)\:]?\s*/i, '').trim())

  return steps.filter(s => s.length > 0)
}

// Estimated nutrition per serving (mock data based on category)
const estimateNutrition = (meal) => {
  const category = meal?.strCategory?.toLowerCase() || ''
  const base = { calories: 350, protein: 20, carbs: 35, fat: 15, fiber: 4 }

  if (category.includes('beef') || category.includes('lamb')) {
    return { calories: 450, protein: 35, carbs: 20, fat: 28, fiber: 2 }
  } else if (category.includes('chicken')) {
    return { calories: 380, protein: 32, carbs: 25, fat: 18, fiber: 3 }
  } else if (category.includes('seafood')) {
    return { calories: 320, protein: 28, carbs: 18, fat: 14, fiber: 2 }
  } else if (category.includes('vegetarian') || category.includes('vegan')) {
    return { calories: 280, protein: 12, carbs: 45, fat: 10, fiber: 8 }
  } else if (category.includes('pasta')) {
    return { calories: 420, protein: 15, carbs: 55, fat: 16, fiber: 4 }
  } else if (category.includes('dessert')) {
    return { calories: 380, protein: 5, carbs: 52, fat: 18, fiber: 1 }
  } else if (category.includes('breakfast')) {
    return { calories: 320, protein: 14, carbs: 38, fat: 14, fiber: 3 }
  }
  return base
}

// Parse time from instruction text (e.g., "cook for 20 minutes")
const parseTimersFromInstructions = (instructions) => {
  if (!instructions) return []
  const timeRegex = /(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)/gi
  const timers = []
  let match

  while ((match = timeRegex.exec(instructions)) !== null) {
    const value = parseInt(match[1], 10)
    const unit = match[2].toLowerCase()
    const minutes = unit.startsWith('hour') || unit.startsWith('hr') ? value * 60 : value
    const context = instructions.substring(Math.max(0, match.index - 30), Math.min(instructions.length, match.index + match[0].length + 30))
    timers.push({ minutes, label: match[0], context: `...${context}...` })
  }
  return timers
}

// Scale ingredient measure
const scaleMeasure = (measure, scale) => {
  if (!measure || scale === 1) return measure

  // Common fraction mappings
  const fractions = {
    '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
    '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
    '1/2': 0.5, '1/3': 1/3, '2/3': 2/3, '1/4': 0.25, '3/4': 0.75,
    '1/8': 0.125, '3/8': 0.375, '5/8': 0.625, '7/8': 0.875,
  }

  // Try to extract number from measure
  let numMatch = measure.match(/^([\d\s½⅓⅔¼¾⅛⅜⅝⅞\/]+)(.*)$/)
  if (!numMatch) return measure

  let numPart = numMatch[1].trim()
  let textPart = numMatch[2].trim()

  // Parse number
  let value = 0
  for (const [frac, num] of Object.entries(fractions)) {
    if (numPart.includes(frac)) {
      value += num
      numPart = numPart.replace(frac, '').trim()
    }
  }

  const wholeNum = parseFloat(numPart)
  if (!isNaN(wholeNum)) {
    value += wholeNum
  }

  if (value === 0) return measure

  // Scale and format
  const scaled = value * scale

  // Format nicely
  const formatNumber = (n) => {
    if (n === Math.floor(n)) return n.toString()
    if (Math.abs(n - 0.25) < 0.01) return '¼'
    if (Math.abs(n - 0.5) < 0.01) return '½'
    if (Math.abs(n - 0.75) < 0.01) return '¾'
    if (Math.abs(n - 0.33) < 0.02) return '⅓'
    if (Math.abs(n - 0.67) < 0.02) return '⅔'
    const whole = Math.floor(n)
    const frac = n - whole
    if (whole > 0) {
      if (Math.abs(frac - 0.5) < 0.1) return `${whole} ½`
      if (Math.abs(frac - 0.25) < 0.1) return `${whole} ¼`
      if (Math.abs(frac - 0.75) < 0.1) return `${whole} ¾`
    }
    return n.toFixed(1).replace(/\.0$/, '')
  }

  return `${formatNumber(scaled)} ${textPart}`.trim()
}

export default function RecipeDetail({ meal }) {
  const {
    isFavorite, addFavorite, removeFavorite, addToMealPlan,
    addIngredientsToShoppingList, markAsCooked, getCookedCount,
    getRecipeNote, setRecipeNote, showToast,
    customCollections, addToCollection, isInCollection,
    dietaryPreferences
  } = useOfflineActions()

  const [showMealPlanModal, setShowMealPlanModal] = useState(false)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showCookingMode, setShowCookingMode] = useState(false)
  const [selectedMealPlanDay, setSelectedMealPlanDay] = useState(null)
  const [servings, setServings] = useState(1)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [note, setNote] = useState('')
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [activeTimer, setActiveTimer] = useState(null)
  const [timerRemaining, setTimerRemaining] = useState(0)
  const [showSubstitutions, setShowSubstitutions] = useState(false)
  const [expandedSub, setExpandedSub] = useState(null)
  const [showLeftovers, setShowLeftovers] = useState(false)
  const [leftoverSuggestions, setLeftoverSuggestions] = useState({})
  const [loadingSuggestions, setLoadingSuggestions] = useState({})
  const [selectedLeftover, setSelectedLeftover] = useState(null)
  // Optimistic UI animation states
  const [favoriteAnimating, setFavoriteAnimating] = useState(false)
  const [cookedAnimating, setCookedAnimating] = useState(false)
  const noteInputRef = useRef(null)
  const timerRef = useRef(null)

  const favorite = isFavorite(meal.idMeal)
  const cookedCount = getCookedCount(meal.idMeal)
  const ingredients = extractIngredients(meal)
  const youtubeUrl = getYouTubeEmbedUrl(meal.strYoutube)
  const baseServings = estimateServings(meal)
  const scale = servings / 1
  const cookingTime = estimateCookingTime(meal)
  const difficulty = estimateDifficulty(meal)
  const ingredientCount = countIngredients(meal)
  const nutrition = estimateNutrition(meal)
  const timers = parseTimersFromInstructions(meal.strInstructions)
  const dietaryTags = detectDietaryTags(meal, ingredients)
  const instructionSteps = parseInstructionsToSteps(meal.strInstructions)

  // Allergen detection from dietary data
  const detectedAllergens = detectAllergens(meal)
  const userAllergens = dietaryPreferences?.allergenFree || []
  const showAllergenWarnings = dietaryPreferences?.showAllergenWarnings ?? true
  const relevantAllergens = detectedAllergens.filter((a) => userAllergens.includes(a.id))

  // Find available substitutions for this recipe's ingredients
  const availableSubstitutions = ingredients
    .map(item => ({
      original: item.ingredient,
      measure: item.measure,
      substitution: findSubstitutes(item.ingredient)
    }))
    .filter(item => item.substitution !== null)

  // Detect potential leftover ingredients
  const potentialLeftovers = detectLeftovers(ingredients)

  // Fetch recipe suggestions for a leftover ingredient
  const fetchLeftoverSuggestions = useCallback(async (ingredient) => {
    if (leftoverSuggestions[ingredient] || loadingSuggestions[ingredient]) return

    setLoadingSuggestions(prev => ({ ...prev, [ingredient]: true }))

    try {
      const recipes = await filterByIngredient(ingredient)
      // Filter out the current recipe and limit to 6 suggestions
      const filtered = recipes
        .filter(r => r.idMeal !== meal.idMeal)
        .slice(0, 6)
      setLeftoverSuggestions(prev => ({ ...prev, [ingredient]: filtered }))
    } catch (error) {
      console.error('Error fetching leftover suggestions:', error)
      setLeftoverSuggestions(prev => ({ ...prev, [ingredient]: [] }))
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [ingredient]: false }))
    }
  }, [meal.idMeal, leftoverSuggestions, loadingSuggestions])

  // Handle clicking on a leftover ingredient to see suggestions
  const handleLeftoverClick = (leftover) => {
    setSelectedLeftover(selectedLeftover === leftover.key ? null : leftover.key)
    fetchLeftoverSuggestions(leftover.key)
  }

  // Load saved note
  useEffect(() => {
    const savedNote = getRecipeNote(meal.idMeal)
    setNote(savedNote)
  }, [meal.idMeal, getRecipeNote])

  // Timer effect
  useEffect(() => {
    if (activeTimer !== null && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setActiveTimer(null)
            showToast('Timer finished!', 'success')
            // Try to play notification sound
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dmJWTjoiBenh5e4CDhomLjY+OjIqIhYKAgH+AgYOFiIqMjY6OjYyKiIaEgoGAgIGDhYeJi4yNjY2MioiGhIKBgICAgoSGiIqMjY6OjYyKiIaDgYCAgIGDhYeJi4yNjo6NjIqIhoSCgYCAgoOFh4mLjI2Ojo2MioiGhIKBgA==')
              audio.play().catch(() => {})
            } catch {}
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [activeTimer, showToast])

  const handleFavoriteClick = () => {
    // Trigger animation immediately for optimistic feedback
    setFavoriteAnimating(true)
    setTimeout(() => setFavoriteAnimating(false), 400)

    if (favorite) {
      removeFavorite(meal.idMeal)
    } else {
      addFavorite(meal)
    }
  }

  const handleSelectDay = (day) => {
    setSelectedMealPlanDay(day)
  }

  const handleAddToSlot = (slot) => {
    if (!selectedMealPlanDay) return
    addToMealPlan(selectedMealPlanDay, slot, {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
    })
    setShowMealPlanModal(false)
    setSelectedMealPlanDay(null)
  }

  const closeMealPlanModal = () => {
    setShowMealPlanModal(false)
    setSelectedMealPlanDay(null)
  }

  const handleAddToShoppingList = () => {
    const scaledIngredients = ingredients.map(ing => ({
      ...ing,
      measure: scaleMeasure(ing.measure, scale)
    }))
    addIngredientsToShoppingList(scaledIngredients, meal.strMeal)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const url = window.location.href
    const text = `Check out this recipe: ${meal.strMeal}`

    if (navigator.share) {
      try {
        await navigator.share({ title: meal.strMeal, text, url })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url)
        }
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('Link copied to clipboard!', 'success')
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  const handleMadeThis = () => {
    // Trigger animation immediately for optimistic feedback
    setCookedAnimating(true)
    setTimeout(() => setCookedAnimating(false), 300)

    markAsCooked(meal.idMeal)
    // Show leftover suggestions if there are potential leftovers
    if (potentialLeftovers.length > 0) {
      setShowLeftovers(true)
    }
  }

  const handleAddToCollection = (collectionId) => {
    addToCollection(collectionId, meal.idMeal)
    setShowCollectionModal(false)
  }

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleSaveNote = () => {
    setRecipeNote(meal.idMeal, note)
    setIsEditingNote(false)
    showToast('Note saved!', 'success')
  }

  const startTimer = (minutes) => {
    setActiveTimer(minutes)
    setTimerRemaining(minutes * 60)
    showToast(`Timer started for ${minutes} minutes`, 'info')
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
    setActiveTimer(null)
    setTimerRemaining(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length

  return (
    <div className="max-w-4xl mx-auto print-recipe">
      {/* Header Image */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <ProgressiveImage
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full"
          aspectRatio="16/9"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent no-print" />
        <div className="absolute bottom-0 left-0 right-0 p-6 no-print">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {meal.strMeal}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/90">
            {meal.strCategory && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {meal.strCategory}
              </span>
            )}
            {meal.strArea && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {meal.strArea}
              </span>
            )}
            {cookingTime && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {cookingTime} min
              </span>
            )}
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Dietary Tags */}
      {dietaryTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {dietaryTags.map(tagKey => {
            const tag = DIETARY_TAGS[tagKey]
            if (!tag) return null
            return (
              <span
                key={tagKey}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${tag.color}`}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            )
          })}
        </div>
      )}

      {/* Allergen Warning - Prominent display for user's allergens */}
      {showAllergenWarnings && relevantAllergens.length > 0 && (
        <div
          className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-300 dark:border-rose-700 rounded-xl"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 text-2xl" aria-hidden="true">⚠️</span>
            <div className="flex-1">
              <h3 className="font-bold text-rose-800 dark:text-rose-200 mb-1">
                Allergen Warning
              </h3>
              <p className="text-rose-700 dark:text-rose-300 mb-3">
                This recipe contains ingredients you've marked as allergens:
              </p>
              <div className="flex flex-wrap gap-2">
                {relevantAllergens.map((allergen) => (
                  <span
                    key={allergen.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-200"
                  >
                    <span aria-hidden="true">{allergen.icon}</span>
                    {allergen.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Detected Allergens - For reference */}
      {detectedAllergens.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-medium">Contains:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {detectedAllergens.map((allergen) => (
              <span
                key={allergen.id}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  userAllergens.includes(allergen.id)
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 ring-2 ring-rose-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <span aria-hidden="true">{allergen.icon}</span>
                {allergen.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Print Header (only visible when printing) */}
      <div className="hidden print:block mb-4">
        <h1 className="text-3xl font-bold">{meal.strMeal}</h1>
        <div className="print-meta">
          {meal.strCategory && <span>Category: {meal.strCategory}</span>}
          {meal.strArea && <span>Cuisine: {meal.strArea}</span>}
          {cookingTime && <span>Time: {cookingTime} min</span>}
          <span>Difficulty: {difficulty}</span>
          <span>Servings: {servings}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 no-print">
        <button
          onClick={handleFavoriteClick}
          className={`btn ${favorite ? 'bg-red-500 text-white hover:bg-red-600' : 'btn-outline'} ${favoriteAnimating ? 'animate-heart-pop' : ''}`}
        >
          <svg
            className={`w-5 h-5 mr-2 ${favoriteAnimating && !favorite ? 'text-red-500' : ''}`}
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {favorite ? 'Favorited' : 'Favorite'}
        </button>
        <button
          onClick={() => setShowMealPlanModal(true)}
          className="btn btn-primary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Meal Plan
        </button>
        <button
          onClick={() => setShowCookingMode(true)}
          className="btn bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Cooking
        </button>
        <button
          onClick={handleAddToShoppingList}
          className="btn btn-secondary"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Shopping List
        </button>
        <button
          onClick={handleMadeThis}
          className={`btn ${cookedCount > 0 ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-50'} ${cookedAnimating ? 'animate-success-pop' : ''}`}
        >
          <svg className={`w-5 h-5 mr-2 ${cookedAnimating ? 'animate-check-draw' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          I Made This{cookedCount > 0 ? ` (${cookedCount})` : ''}
        </button>
        <button onClick={handlePrint} className="btn btn-ghost">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
        <button onClick={handleShare} className="btn btn-ghost">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        {customCollections.length > 0 && (
          <button onClick={() => setShowCollectionModal(true)} className="btn btn-ghost">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Collection
          </button>
        )}
      </div>

      {/* Leftover Suggestions Panel */}
      {showLeftovers && potentialLeftovers.length > 0 && (
        <div className="mb-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-xl border border-teal-100 dark:border-teal-800/50 overflow-hidden no-print">
          <div className="p-4 border-b border-teal-100 dark:border-teal-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Leftover Ingredients?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You might have leftovers from this recipe. Here's what to do with them!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLeftovers(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {potentialLeftovers.map((leftover) => (
                <button
                  key={leftover.key}
                  onClick={() => handleLeftoverClick(leftover)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLeftover === leftover.key
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span>{leftover.icon}</span>
                  <span className="capitalize">{leftover.name}</span>
                </button>
              ))}
            </div>

            {selectedLeftover && (
              <div className="space-y-4">
                {/* Storage tip for selected ingredient */}
                {potentialLeftovers.find(l => l.key === selectedLeftover) && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {potentialLeftovers.find(l => l.key === selectedLeftover)?.icon}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {selectedLeftover}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Lasts: {potentialLeftovers.find(l => l.key === selectedLeftover)?.shelfLife}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {potentialLeftovers.find(l => l.key === selectedLeftover)?.storage}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recipe suggestions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Recipes to use up your <span className="text-teal-600 dark:text-teal-400 capitalize">{selectedLeftover}</span>:
                  </h4>

                  {loadingSuggestions[selectedLeftover] ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                          <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          <div className="p-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : leftoverSuggestions[selectedLeftover]?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {leftoverSuggestions[selectedLeftover].map((recipe) => (
                        <a
                          key={recipe.idMeal}
                          href={`/recipe/${recipe.idMeal}`}
                          className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-700 transition-all"
                        >
                          <div className="relative overflow-hidden">
                            <ProgressiveImage
                              src={recipe.strMealThumb}
                              alt={recipe.strMeal}
                              className="w-full group-hover:scale-105 transition-transform duration-300"
                              aspectRatio="16/9"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {recipe.strMeal}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No additional recipes found for this ingredient.
                    </p>
                  )}
                </div>
              </div>
            )}

            {!selectedLeftover && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                Click on an ingredient above to see recipe suggestions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Active Timer Banner */}
      {activeTimer !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm opacity-80">Timer running</p>
              <p className="text-2xl font-bold">{formatTime(timerRemaining)}</p>
            </div>
          </div>
          <button
            onClick={stopTimer}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Servings Selector */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm no-print">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Servings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Adjust ingredient quantities</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-semibold transition-colors"
              disabled={servings <= 1}
            >
              −
            </button>
            <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-semibold transition-colors"
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {[1, 2, 4, 6].map(num => (
            <button
              key={num}
              onClick={() => setServings(num)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                servings === num
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {num}x
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24 print-ingredients">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ingredients</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 no-print">
                {checkedCount}/{ingredients.length}
              </span>
            </div>
            <ul className="space-y-2">
              {ingredients.map((item, index) => {
                const isChecked = checkedIngredients[index]
                const scaledMeasure = scaleMeasure(item.measure, scale)
                const icon = getIngredientIcon(item.ingredient)
                return (
                  <li key={index} className="flex items-center group">
                    <button
                      onClick={() => toggleIngredient(index)}
                      className={`flex-shrink-0 w-6 h-6 mr-3 rounded-lg border-2 transition-all no-print flex items-center justify-center ${
                        isChecked
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-400 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      {isChecked ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
                      )}
                    </button>
                    <span className="print-checkbox hidden print:inline-block" />
                    <span className={`flex-1 transition-all ${isChecked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      <span className="font-semibold text-gray-900 dark:text-white">{scaledMeasure}</span>{' '}
                      {item.ingredient}
                    </span>
                    <span className="text-lg ml-2 opacity-50 no-print">{icon !== '•' ? icon : ''}</span>
                  </li>
                )
              })}
            </ul>
            {checkedCount === ingredients.length && ingredients.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2 no-print">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All ingredients ready!
              </div>
            )}

            {/* Ingredient Substitutions */}
            {availableSubstitutions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 no-print">
                <button
                  onClick={() => setShowSubstitutions(!showSubstitutions)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔄</span>
                    <span className="font-medium text-gray-900 dark:text-white">Substitutions Available</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {availableSubstitutions.length}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${showSubstitutions ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showSubstitutions && (
                  <div className="mt-4 space-y-3">
                    {availableSubstitutions.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-100 dark:border-amber-800/50 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedSub(expandedSub === index ? null : index)}
                          className="w-full p-3 flex items-start gap-3 text-left"
                        >
                          <span className="text-amber-500 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Don't have <span className="font-semibold text-gray-900 dark:text-white">{item.original}</span>?
                            </p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 truncate">
                              Try: {item.substitution.subs.slice(0, 2).join(', ')}
                              {item.substitution.subs.length > 2 && ` +${item.substitution.subs.length - 2} more`}
                            </p>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 mt-1 ${expandedSub === index ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {expandedSub === index && (
                          <div className="px-3 pb-3 pt-0">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Substitutes for {item.substitution.ingredient}:
                              </p>
                              <ul className="space-y-1.5">
                                {item.substitution.subs.map((sub, subIdx) => (
                                  <li key={subIdx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                              {item.substitution.notes && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <span className="font-medium">Tip:</span> {item.substitution.notes}
                                </p>
                              )}
                              {item.substitution.ratio && (
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                  <span className="font-medium">Ratio:</span> {item.substitution.ratio}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions & More */}
        <div className="md:col-span-2 space-y-6">
          {/* Nutrition Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 no-print">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Nutrition (per serving)</h2>
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{Math.round(nutrition.calories * scale)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calories</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{Math.round(nutrition.protein * scale)}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Protein</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.round(nutrition.carbs * scale)}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Carbs</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{Math.round(nutrition.fat * scale)}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fat</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(nutrition.fiber * scale)}g</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fiber</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">*Estimated values based on recipe category</p>
          </div>

          {/* Quick Timers */}
          {timers.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 no-print">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Timers</h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set(timers.map(t => t.minutes))].slice(0, 6).map((mins, i) => (
                  <button
                    key={i}
                    onClick={() => startTimer(mins)}
                    disabled={activeTimer !== null}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      activeTimer !== null
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mins} min
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 print-instructions">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Instructions</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{instructionSteps.length} steps</span>
            </div>
            <div className="space-y-6">
              {instructionSteps.map((step, index) => (
                <div key={index} className="flex gap-4 group">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    {index < instructionSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-primary-200 to-transparent dark:from-primary-800 mx-auto mt-2 min-h-[20px]" />
                    )}
                  </div>
                  {/* Step Content */}
                  <div className="flex-1 pb-2">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Completion message */}
            {instructionSteps.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                <span className="text-2xl">🎉</span>
                <span className="font-medium">Enjoy your meal!</span>
              </div>
            )}
          </div>

          {/* Personal Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 print-notes">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Notes</h2>
              {!isEditingNote && note && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline no-print"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingNote ? (
              <div className="space-y-3 no-print">
                <textarea
                  ref={noteInputRef}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add your personal notes, tips, or modifications for this recipe..."
                  className="w-full h-32 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNote}
                    className="btn btn-primary px-4 py-2"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setNote(getRecipeNote(meal.idMeal))
                      setIsEditingNote(false)
                    }}
                    className="btn btn-ghost px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : note ? (
              <>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note}</p>
                <p className="hidden print:block">{note}</p>
              </>
            ) : (
              <button
                onClick={() => setIsEditingNote(true)}
                className="w-full p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-print"
              >
                + Add personal notes for this recipe
              </button>
            )}
          </div>

          {/* Video */}
          {youtubeUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 no-print">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Video Tutorial</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={youtubeUrl}
                  title={`${meal.strMeal} video tutorial`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {meal.strTags && (
            <div className="flex flex-wrap gap-2 no-print">
              {meal.strTags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Recipe Enhancements Panel */}
          <div className="no-print">
            <RecipeEnhancementsPanel meal={meal} />
          </div>
        </div>
      </div>

      {/* Meal Plan Modal */}
      {showMealPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add to Meal Plan</h3>
              <button
                onClick={closeMealPlanModal}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!selectedMealPlanDay ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a day:</p>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      className="btn btn-secondary capitalize py-3"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setSelectedMealPlanDay(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedMealPlanDay}</span>
                    {' '}- Choose a meal:
                  </p>
                </div>
                <div className="space-y-2">
                  {MEAL_SLOTS.map((slot) => {
                    const config = SLOT_CONFIG[slot]
                    return (
                      <button
                        key={slot}
                        onClick={() => handleAddToSlot(slot)}
                        className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors text-left group"
                      >
                        <span className="text-2xl">{config.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {config.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {slot === 'snacks' ? 'Add as a snack' : `Set as ${config.label.toLowerCase()}`}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            <button
              onClick={closeMealPlanModal}
              className="mt-4 w-full btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add to Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add to Collection</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a collection:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {customCollections.map((collection) => {
                const alreadyIn = isInCollection(collection.id, meal.idMeal)
                return (
                  <button
                    key={collection.id}
                    onClick={() => !alreadyIn && handleAddToCollection(collection.id)}
                    disabled={alreadyIn}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      alreadyIn
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <span className="text-2xl">{collection.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{collection.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {collection.recipeIds.length} recipe{collection.recipeIds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {alreadyIn && (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full">
                        Added
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowCollectionModal(false)}
              className="mt-4 w-full btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Cooking Mode */}
      {showCookingMode && (
        <CookingMode
          meal={meal}
          steps={instructionSteps}
          onClose={() => setShowCookingMode(false)}
        />
      )}
    </div>
  )
}

export function RecipeDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="skeleton aspect-video rounded-xl mb-6" />
      <div className="flex gap-3 mb-8">
        <div className="skeleton h-10 w-32 rounded-lg" />
        <div className="skeleton h-10 w-32 rounded-lg" />
        <div className="skeleton h-10 w-32 rounded-lg" />
        <div className="skeleton h-10 w-24 rounded-lg" />
      </div>
      <div className="skeleton h-16 rounded-xl mb-6" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="skeleton h-80 rounded-xl" />
        <div className="md:col-span-2 space-y-6">
          <div className="skeleton h-32 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
