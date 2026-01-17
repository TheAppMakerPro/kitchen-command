// Nutritional data per 100g for common ingredients
// Values: calories (kcal), protein (g), carbs (g), fat (g), fiber (g)

export const nutritionDatabase = {
  // Proteins
  'chicken': { calories: 239, protein: 27, carbs: 0, fat: 14, fiber: 0 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  'beef mince': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  'ground beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  'minced beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0 },
  'steak': { calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0 },
  'lamb': { calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0 },
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0 },
  'bacon': { calories: 541, protein: 37, carbs: 1.4, fat: 42, fiber: 0 },
  'sausage': { calories: 301, protein: 12, carbs: 2, fat: 27, fiber: 0 },
  'sausages': { calories: 301, protein: 12, carbs: 2, fat: 27, fiber: 0 },
  'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  'tuna': { calories: 132, protein: 28, carbs: 0, fat: 1, fiber: 0 },
  'cod': { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 },
  'prawns': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0 },
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  'tofu': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3 },
  'turkey': { calories: 189, protein: 29, carbs: 0, fat: 7, fiber: 0 },

  // Dairy
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  'cheddar cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  'parmesan': { calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0 },
  'parmesan cheese': { calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0 },
  'mozzarella': { calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0 },
  'cream': { calories: 340, protein: 2.8, carbs: 2.8, fat: 36, fiber: 0 },
  'double cream': { calories: 449, protein: 1.6, carbs: 2.6, fat: 48, fiber: 0 },
  'sour cream': { calories: 193, protein: 2.4, carbs: 4.6, fat: 19, fiber: 0 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0 },
  'greek yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0 },
  'cream cheese': { calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0 },
  'feta': { calories: 264, protein: 14, carbs: 4.1, fat: 21, fiber: 0 },
  'feta cheese': { calories: 264, protein: 14, carbs: 4.1, fat: 21, fiber: 0 },
  'ricotta': { calories: 174, protein: 11, carbs: 3, fat: 13, fiber: 0 },

  // Grains & Carbs
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  'white rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  'brown rice': { calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8 },
  'basmati rice': { calories: 121, protein: 3.5, carbs: 25, fat: 0.4, fiber: 0.4 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  'spaghetti': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  'penne': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  'noodles': { calories: 138, protein: 4.5, carbs: 25, fat: 2.1, fiber: 1.2 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7 },
  'flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
  'plain flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
  'self-raising flour': { calories: 349, protein: 9.8, carbs: 74, fat: 1.2, fiber: 3.1 },
  'breadcrumbs': { calories: 395, protein: 13, carbs: 72, fat: 5.3, fiber: 4.5 },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  'potatoes': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 },
  'tortilla': { calories: 312, protein: 8, carbs: 52, fat: 8, fiber: 3.5 },
  'pita': { calories: 275, protein: 9, carbs: 55, fat: 1.2, fiber: 2.2 },
  'couscous': { calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4 },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8 },

  // Vegetables
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  'onions': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'tomatoes': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'cherry tomatoes': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  'carrots': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  'celery': { calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6 },
  'pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
  'bell pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
  'red pepper': { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 },
  'green pepper': { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7 },
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 },
  'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3 },
  'cucumber': { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 },
  'mushroom': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 },
  'mushrooms': { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 },
  'zucchini': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 },
  'courgette': { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 },
  'aubergine': { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3 },
  'eggplant': { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3 },
  'cabbage': { calories: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5 },
  'cauliflower': { calories: 25, protein: 2, carbs: 5, fat: 0.3, fiber: 2 },
  'corn': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 },
  'sweetcorn': { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7 },
  'peas': { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1 },
  'green beans': { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4 },
  'asparagus': { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1 },
  'leek': { calories: 61, protein: 1.5, carbs: 14, fat: 0.3, fiber: 1.8 },
  'leeks': { calories: 61, protein: 1.5, carbs: 14, fat: 0.3, fiber: 1.8 },
  'kale': { calories: 49, protein: 4.3, carbs: 9, fat: 0.9, fiber: 3.6 },
  'spring onion': { calories: 32, protein: 1.8, carbs: 7.3, fat: 0.2, fiber: 2.6 },
  'spring onions': { calories: 32, protein: 1.8, carbs: 7.3, fat: 0.2, fiber: 2.6 },
  'shallot': { calories: 72, protein: 2.5, carbs: 17, fat: 0.1, fiber: 3.2 },
  'shallots': { calories: 72, protein: 2.5, carbs: 17, fat: 0.1, fiber: 3.2 },

  // Fruits
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6 },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4 },
  'lemon': { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8 },
  'lemon juice': { calories: 22, protein: 0.4, carbs: 6.9, fat: 0.2, fiber: 0.3 },
  'lime': { calories: 30, protein: 0.7, carbs: 11, fat: 0.2, fiber: 2.8 },
  'lime juice': { calories: 25, protein: 0.4, carbs: 8.4, fat: 0.1, fiber: 0.4 },
  'strawberries': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 },
  'blueberries': { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4 },
  'mango': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 },
  'pineapple': { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 },
  'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7 },
  'raisins': { calories: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7 },
  'sultanas': { calories: 299, protein: 2.5, carbs: 75, fat: 0.4, fiber: 4.5 },
  'dates': { calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 7 },
  'coconut': { calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9 },
  'coconut milk': { calories: 197, protein: 2.2, carbs: 2.8, fat: 21, fiber: 0 },
  'coconut cream': { calories: 330, protein: 3.6, carbs: 6.6, fat: 35, fiber: 2 },

  // Legumes & Beans
  'beans': { calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4 },
  'kidney beans': { calories: 127, protein: 8.7, carbs: 23, fat: 0.5, fiber: 6.4 },
  'black beans': { calories: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7 },
  'chickpeas': { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6 },
  'lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
  'red lentils': { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 7.9 },
  'baked beans': { calories: 94, protein: 5.2, carbs: 17, fat: 0.5, fiber: 5.5 },
  'cannellini beans': { calories: 91, protein: 6.2, carbs: 17, fat: 0.3, fiber: 5 },
  'butter beans': { calories: 103, protein: 6.8, carbs: 19, fat: 0.4, fiber: 7 },

  // Nuts & Seeds
  'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12 },
  'cashews': { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3 },
  'peanuts': { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5 },
  'peanut butter': { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 },
  'walnuts': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7 },
  'pine nuts': { calories: 673, protein: 14, carbs: 13, fat: 68, fiber: 3.7 },
  'sesame seeds': { calories: 573, protein: 18, carbs: 23, fat: 50, fiber: 12 },
  'sunflower seeds': { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6 },
  'chia seeds': { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34 },
  'flax seeds': { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27 },

  // Oils & Fats
  'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'vegetable oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'sunflower oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'coconut oil': { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0 },
  'sesame oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 },

  // Sauces & Condiments
  'tomato paste': { calories: 82, protein: 4.3, carbs: 19, fat: 0.5, fiber: 4.1 },
  'tomato puree': { calories: 38, protein: 1.6, carbs: 8.8, fat: 0.2, fiber: 1.9 },
  'chopped tomatoes': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'passata': { calories: 24, protein: 1.3, carbs: 4.2, fat: 0.1, fiber: 1.3 },
  'soy sauce': { calories: 53, protein: 8.1, carbs: 4.9, fat: 0.1, fiber: 0.8 },
  'fish sauce': { calories: 35, protein: 5.1, carbs: 3.6, fat: 0, fiber: 0 },
  'worcestershire sauce': { calories: 78, protein: 0, carbs: 19, fat: 0, fiber: 0 },
  'honey': { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 },
  'maple syrup': { calories: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0 },
  'sugar': { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0 },
  'brown sugar': { calories: 377, protein: 0, carbs: 97, fat: 0, fiber: 0 },
  'mayonnaise': { calories: 680, protein: 1, carbs: 0.6, fat: 75, fiber: 0 },
  'mustard': { calories: 66, protein: 4.4, carbs: 6, fat: 4, fiber: 3.3 },
  'ketchup': { calories: 112, protein: 1.8, carbs: 26, fat: 0.5, fiber: 0.3 },
  'vinegar': { calories: 18, protein: 0, carbs: 0.6, fat: 0, fiber: 0 },
  'balsamic vinegar': { calories: 88, protein: 0.5, carbs: 17, fat: 0, fiber: 0 },
  'hot sauce': { calories: 11, protein: 0.5, carbs: 2, fat: 0.4, fiber: 0.8 },
  'salsa': { calories: 36, protein: 1.5, carbs: 7, fat: 0.3, fiber: 1.9 },
  'hummus': { calories: 166, protein: 7.9, carbs: 14, fat: 9.6, fiber: 6 },
  'pesto': { calories: 387, protein: 4.6, carbs: 6.4, fat: 38, fiber: 2.1 },
  'tahini': { calories: 595, protein: 17, carbs: 21, fat: 54, fiber: 9.3 },

  // Spices & Herbs (small amounts, low impact)
  'salt': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  'pepper': { calories: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25 },
  'black pepper': { calories: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25 },
  'paprika': { calories: 282, protein: 14, carbs: 54, fat: 13, fiber: 35 },
  'cumin': { calories: 375, protein: 18, carbs: 44, fat: 22, fiber: 11 },
  'coriander': { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 },
  'cilantro': { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 },
  'basil': { calories: 23, protein: 3.2, carbs: 2.7, fat: 0.6, fiber: 1.6 },
  'oregano': { calories: 265, protein: 9, carbs: 69, fat: 4.3, fiber: 43 },
  'thyme': { calories: 101, protein: 5.6, carbs: 24, fat: 1.7, fiber: 14 },
  'rosemary': { calories: 131, protein: 3.3, carbs: 21, fat: 5.9, fiber: 14 },
  'parsley': { calories: 36, protein: 3, carbs: 6.3, fat: 0.8, fiber: 3.3 },
  'mint': { calories: 44, protein: 3.3, carbs: 8.4, fat: 0.7, fiber: 6.8 },
  'ginger': { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 },
  'turmeric': { calories: 354, protein: 8, carbs: 65, fat: 10, fiber: 21 },
  'cinnamon': { calories: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53 },
  'nutmeg': { calories: 525, protein: 6, carbs: 49, fat: 36, fiber: 21 },
  'chili': { calories: 40, protein: 1.9, carbs: 9, fat: 0.4, fiber: 1.5 },
  'chilli': { calories: 40, protein: 1.9, carbs: 9, fat: 0.4, fiber: 1.5 },
  'chili powder': { calories: 282, protein: 12, carbs: 50, fat: 14, fiber: 35 },
  'curry powder': { calories: 325, protein: 13, carbs: 58, fat: 14, fiber: 33 },
  'bay leaf': { calories: 313, protein: 8, carbs: 75, fat: 8.4, fiber: 26 },
  'bay leaves': { calories: 313, protein: 8, carbs: 75, fat: 8.4, fiber: 26 },

  // Stocks & Broths
  'chicken stock': { calories: 7, protein: 1.2, carbs: 0.3, fat: 0.2, fiber: 0 },
  'beef stock': { calories: 8, protein: 1.3, carbs: 0.3, fat: 0.2, fiber: 0 },
  'vegetable stock': { calories: 6, protein: 0.3, carbs: 1.2, fat: 0.1, fiber: 0 },
  'stock cube': { calories: 259, protein: 15, carbs: 23, fat: 14, fiber: 0 },

  // Alcohol (for cooking)
  'wine': { calories: 83, protein: 0.1, carbs: 2.7, fat: 0, fiber: 0 },
  'red wine': { calories: 85, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 },
  'white wine': { calories: 82, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 },
  'beer': { calories: 43, protein: 0.5, carbs: 3.6, fat: 0, fiber: 0 },

  // Baking
  'baking powder': { calories: 53, protein: 0, carbs: 28, fat: 0, fiber: 0 },
  'baking soda': { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  'yeast': { calories: 325, protein: 40, carbs: 41, fat: 7.6, fiber: 21 },
  'cocoa': { calories: 228, protein: 20, carbs: 58, fat: 14, fiber: 33 },
  'cocoa powder': { calories: 228, protein: 20, carbs: 58, fat: 14, fiber: 33 },
  'chocolate': { calories: 546, protein: 5, carbs: 60, fat: 31, fiber: 7 },
  'dark chocolate': { calories: 546, protein: 5, carbs: 60, fat: 31, fiber: 7 },
  'vanilla': { calories: 288, protein: 0.1, carbs: 13, fat: 0.1, fiber: 0 },
  'vanilla extract': { calories: 288, protein: 0.1, carbs: 13, fat: 0.1, fiber: 0 },

  // Default fallback for unknown ingredients
  'default': { calories: 100, protein: 3, carbs: 15, fat: 3, fiber: 1 },
}

// Parse measure string to get approximate grams
export function parseMeasure(measure) {
  if (!measure) return 100 // Default to 100g if no measure

  const lowerMeasure = measure.toLowerCase().trim()

  // Common conversions to grams
  const conversions = {
    // Volume measures (approximate for typical ingredients)
    'cup': 240,
    'cups': 240,
    '1/2 cup': 120,
    '1/4 cup': 60,
    '3/4 cup': 180,
    '1/3 cup': 80,
    '2/3 cup': 160,
    'tbsp': 15,
    'tablespoon': 15,
    'tablespoons': 15,
    'tbs': 15,
    'tsp': 5,
    'teaspoon': 5,
    'teaspoons': 5,

    // Weight measures
    'kg': 1000,
    'g': 1,
    'gram': 1,
    'grams': 1,
    'oz': 28,
    'ounce': 28,
    'ounces': 28,
    'lb': 454,
    'pound': 454,
    'pounds': 454,
    'lbs': 454,

    // Count measures (rough estimates)
    'clove': 5,
    'cloves': 5,
    'slice': 30,
    'slices': 30,
    'piece': 100,
    'pieces': 100,
    'small': 75,
    'medium': 100,
    'large': 150,
    'whole': 100,

    // Liquid measures
    'ml': 1,
    'l': 1000,
    'liter': 1000,
    'litre': 1000,
    'pint': 473,
    'fl oz': 30,
  }

  // Try to extract numeric value
  const numMatch = lowerMeasure.match(/^([\d./]+)/)
  let quantity = 1

  if (numMatch) {
    const numStr = numMatch[1]
    if (numStr.includes('/')) {
      const [num, den] = numStr.split('/')
      quantity = parseFloat(num) / parseFloat(den)
    } else {
      quantity = parseFloat(numStr)
    }
  }

  // Check for conversion keywords
  for (const [key, grams] of Object.entries(conversions)) {
    if (lowerMeasure.includes(key)) {
      return quantity * grams
    }
  }

  // If just a number, assume it's count * 100g
  if (!isNaN(quantity) && lowerMeasure.match(/^\d+$/)) {
    return quantity * 100
  }

  // Default assumption
  return quantity * 100
}

// Get nutrition data for an ingredient
export function getNutritionForIngredient(ingredient, measure) {
  const lowerIngredient = ingredient.toLowerCase().trim()

  // Try exact match first
  if (nutritionDatabase[lowerIngredient]) {
    const data = nutritionDatabase[lowerIngredient]
    const grams = parseMeasure(measure)
    const multiplier = grams / 100

    return {
      calories: Math.round(data.calories * multiplier),
      protein: Math.round(data.protein * multiplier * 10) / 10,
      carbs: Math.round(data.carbs * multiplier * 10) / 10,
      fat: Math.round(data.fat * multiplier * 10) / 10,
      fiber: Math.round(data.fiber * multiplier * 10) / 10,
    }
  }

  // Try partial match
  for (const [key, data] of Object.entries(nutritionDatabase)) {
    if (lowerIngredient.includes(key) || key.includes(lowerIngredient)) {
      const grams = parseMeasure(measure)
      const multiplier = grams / 100

      return {
        calories: Math.round(data.calories * multiplier),
        protein: Math.round(data.protein * multiplier * 10) / 10,
        carbs: Math.round(data.carbs * multiplier * 10) / 10,
        fat: Math.round(data.fat * multiplier * 10) / 10,
        fiber: Math.round(data.fiber * multiplier * 10) / 10,
      }
    }
  }

  // Use default values
  const data = nutritionDatabase['default']
  const grams = parseMeasure(measure)
  const multiplier = grams / 100

  return {
    calories: Math.round(data.calories * multiplier),
    protein: Math.round(data.protein * multiplier * 10) / 10,
    carbs: Math.round(data.carbs * multiplier * 10) / 10,
    fat: Math.round(data.fat * multiplier * 10) / 10,
    fiber: Math.round(data.fiber * multiplier * 10) / 10,
  }
}

// Calculate total nutrition for a recipe (array of {ingredient, measure})
export function calculateRecipeNutrition(ingredients) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  }

  ingredients.forEach(({ ingredient, measure }) => {
    const nutrition = getNutritionForIngredient(ingredient, measure)
    totals.calories += nutrition.calories
    totals.protein += nutrition.protein
    totals.carbs += nutrition.carbs
    totals.fat += nutrition.fat
    totals.fiber += nutrition.fiber
  })

  // Round totals
  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
  }
}

// Default daily targets (can be customized by user)
export const DEFAULT_DAILY_TARGETS = {
  calories: 2000,
  protein: 50, // grams
  carbs: 250, // grams
  fat: 65, // grams
  fiber: 25, // grams
}

// Get balance status for a value against target
export function getBalanceStatus(value, target, type = 'normal') {
  const percentage = (value / target) * 100

  if (type === 'calories') {
    if (percentage < 80) return { status: 'low', color: 'yellow', label: 'Under' }
    if (percentage <= 110) return { status: 'good', color: 'green', label: 'On Track' }
    return { status: 'high', color: 'red', label: 'Over' }
  }

  if (type === 'fiber') {
    // For fiber, higher is generally better
    if (percentage < 70) return { status: 'low', color: 'yellow', label: 'Low' }
    if (percentage <= 150) return { status: 'good', color: 'green', label: 'Good' }
    return { status: 'high', color: 'green', label: 'Excellent' }
  }

  // For macros (protein, carbs, fat)
  if (percentage < 70) return { status: 'low', color: 'yellow', label: 'Low' }
  if (percentage <= 130) return { status: 'good', color: 'green', label: 'Good' }
  return { status: 'high', color: 'orange', label: 'High' }
}

// Macro distribution percentages (ideal ranges)
export const MACRO_RANGES = {
  protein: { min: 10, max: 35, ideal: 20 }, // % of calories
  carbs: { min: 45, max: 65, ideal: 50 },
  fat: { min: 20, max: 35, ideal: 30 },
}

// Calculate macro percentages from nutrition
export function calculateMacroPercentages(nutrition) {
  const proteinCalories = nutrition.protein * 4
  const carbsCalories = nutrition.carbs * 4
  const fatCalories = nutrition.fat * 9
  const totalCalories = proteinCalories + carbsCalories + fatCalories

  if (totalCalories === 0) {
    return { protein: 0, carbs: 0, fat: 0 }
  }

  return {
    protein: Math.round((proteinCalories / totalCalories) * 100),
    carbs: Math.round((carbsCalories / totalCalories) * 100),
    fat: Math.round((fatCalories / totalCalories) * 100),
  }
}
