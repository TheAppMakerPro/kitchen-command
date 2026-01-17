// Meal Prep Guides Data
// Batch cooking strategies, tips, and tutorials

export const PREP_CATEGORIES = [
  { id: 'proteins', label: 'Proteins', icon: '🍗' },
  { id: 'grains', label: 'Grains & Starches', icon: '🍚' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'sauces', label: 'Sauces & Dressings', icon: '🫙' },
  { id: 'breakfast', label: 'Breakfast', icon: '🥣' },
  { id: 'snacks', label: 'Snacks', icon: '🍎' },
]

export const PREP_GUIDES = [
  // PROTEINS
  {
    id: 'batch-chicken',
    name: 'Batch Cooked Chicken',
    category: 'proteins',
    prepTime: '15 min',
    cookTime: '30-45 min',
    yield: '4-6 meals',
    storageLife: '4 days fridge, 3 months freezer',
    difficulty: 'Easy',
    description: 'Master batch-cooking chicken for quick weeknight meals. Season different ways for variety.',
    whyItWorks: 'Pre-cooked chicken is the ultimate meal prep protein. It reheats well, works in countless recipes, and saves significant cooking time during the week.',
    ingredients: [
      '2-3 lbs boneless, skinless chicken breasts or thighs',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      'Your choice of seasonings (see variations)',
    ],
    steps: [
      'Pound chicken to even thickness (about 3/4 inch) for even cooking',
      'Season generously with salt, pepper, and chosen spices',
      'Heat oil in large oven-safe skillet over medium-high heat',
      'Sear chicken 3-4 minutes per side until golden',
      'Transfer to 400°F oven and bake until internal temp reaches 165°F (15-20 min)',
      'Rest 5-10 minutes before slicing or shredding',
      'Cool completely before storing',
    ],
    variations: [
      { name: 'Mediterranean', seasonings: 'Oregano, garlic, lemon zest, paprika' },
      { name: 'Mexican', seasonings: 'Cumin, chili powder, garlic, lime' },
      { name: 'Asian', seasonings: 'Ginger, garlic, five-spice, sesame' },
      { name: 'BBQ', seasonings: 'Smoked paprika, brown sugar, garlic, onion powder' },
    ],
    usageIdeas: [
      'Salads and grain bowls',
      'Wraps and sandwiches',
      'Stir-fries and fried rice',
      'Soup and pasta dishes',
      'Tacos and quesadillas',
    ],
    proTips: [
      'Cook thighs for more moisture and flavor',
      'Don\'t skip the resting time - keeps it juicy',
      'Store sliced and shredded separately for versatility',
      'Freeze in portions with cooking liquid for moisture',
    ],
  },
  {
    id: 'pulled-pork',
    name: 'Slow Cooker Pulled Pork',
    category: 'proteins',
    prepTime: '15 min',
    cookTime: '8-10 hours',
    yield: '8-10 meals',
    storageLife: '5 days fridge, 3 months freezer',
    difficulty: 'Easy',
    description: 'Set it and forget it pulled pork that\'s incredibly versatile.',
    whyItWorks: 'Low and slow cooking breaks down tough connective tissue, resulting in tender, shreddable meat. The large yield makes it economical and time-efficient.',
    ingredients: [
      '4-5 lb pork shoulder (bone-in for more flavor)',
      '2 tbsp brown sugar',
      '1 tbsp paprika',
      '1 tbsp garlic powder',
      '1 tsp cumin',
      'Salt and pepper',
      '1 cup chicken broth or apple cider',
    ],
    steps: [
      'Mix dry rub ingredients and coat pork generously',
      'Place pork in slow cooker, fat side up',
      'Add liquid to bottom of cooker',
      'Cook on LOW for 8-10 hours until fork tender',
      'Remove and let rest 10 minutes',
      'Shred with two forks, discarding fat and bone',
      'Toss with some cooking liquid to keep moist',
      'Portion and cool before storing',
    ],
    variations: [
      { name: 'Carolina Style', seasonings: 'Apple cider vinegar, mustard, honey' },
      { name: 'Carnitas', seasonings: 'Orange juice, cumin, oregano, bay leaves' },
      { name: 'Korean', seasonings: 'Gochujang, soy sauce, ginger, sesame' },
      { name: 'Classic BBQ', seasonings: 'Your favorite BBQ sauce added after shredding' },
    ],
    usageIdeas: [
      'Sandwiches and sliders',
      'Tacos and burritos',
      'Rice bowls',
      'Loaded nachos',
      'Pizza topping',
      'Eggs benedict variation',
    ],
    proTips: [
      'Bone-in gives better flavor, boneless is easier',
      'Crisp under broiler for carnitas-style',
      'Freeze in flat portions for quick thawing',
      'Save the cooking liquid - it\'s liquid gold',
    ],
  },
  {
    id: 'hard-boiled-eggs',
    name: 'Perfect Hard-Boiled Eggs',
    category: 'proteins',
    prepTime: '5 min',
    cookTime: '12-14 min',
    yield: '12 eggs',
    storageLife: '7 days fridge (unpeeled)',
    difficulty: 'Easy',
    description: 'Foolproof hard-boiled eggs that peel easily every time.',
    whyItWorks: 'Starting in cold water and shocking in ice water makes eggs easier to peel and prevents the green ring around the yolk.',
    ingredients: [
      '12 large eggs',
      'Water to cover',
      'Ice bath',
    ],
    steps: [
      'Place eggs in single layer in large pot',
      'Cover with cold water by 1 inch',
      'Bring to rolling boil over high heat',
      'Remove from heat, cover, let sit 12-14 minutes',
      'Transfer immediately to ice bath for 5 minutes',
      'Peel under running water or store unpeeled',
    ],
    variations: [
      { name: 'Soft-boiled', seasonings: '6-7 minutes for jammy yolk' },
      { name: 'Medium', seasonings: '9-10 minutes for slightly soft center' },
      { name: 'Instant Pot', seasonings: '5 min high pressure, 5 min natural release' },
    ],
    usageIdeas: [
      'Quick protein snack',
      'Salad topping',
      'Egg salad sandwiches',
      'Deviled eggs',
      'Ramen topping',
      'Breakfast on the go',
    ],
    proTips: [
      'Older eggs peel easier than fresh',
      'Add 1 tsp baking soda to water for easier peeling',
      'Don\'t skip the ice bath',
      'Store unpeeled for longest freshness',
    ],
  },

  // GRAINS
  {
    id: 'batch-rice',
    name: 'Batch Cooked Rice',
    category: 'grains',
    prepTime: '5 min',
    cookTime: '20-25 min',
    yield: '6-8 servings',
    storageLife: '5 days fridge, 3 months freezer',
    difficulty: 'Easy',
    description: 'Cook rice once, use it all week. Freezes beautifully.',
    whyItWorks: 'Having cooked rice ready means fried rice, grain bowls, and sides are minutes away instead of 30+ minutes.',
    ingredients: [
      '2 cups long-grain rice (jasmine or basmati)',
      '3 cups water',
      '1 tsp salt',
      '1 tbsp butter or oil (optional)',
    ],
    steps: [
      'Rinse rice until water runs clear',
      'Combine rice, water, and salt in pot',
      'Bring to boil, then reduce to low',
      'Cover and simmer 18 minutes (don\'t peek!)',
      'Remove from heat, let stand 5 minutes',
      'Fluff with fork and spread on sheet pan to cool',
      'Portion into containers when cooled',
    ],
    variations: [
      { name: 'Brown Rice', seasonings: 'Use 2.5 cups water, cook 45 minutes' },
      { name: 'Coconut Rice', seasonings: 'Replace half water with coconut milk' },
      { name: 'Cilantro Lime', seasonings: 'Add lime juice and cilantro after cooking' },
      { name: 'Pilaf Style', seasonings: 'Sauté rice in butter before adding liquid' },
    ],
    usageIdeas: [
      'Fried rice (day-old rice is best)',
      'Grain bowls',
      'Burritos and burrito bowls',
      'Stuffed peppers',
      'Rice pudding',
      'Side dish',
    ],
    proTips: [
      'Day-old refrigerated rice makes the best fried rice',
      'Freeze in flat portions for quick reheating',
      'Add a splash of water when reheating',
      'Rinse to remove excess starch for fluffier rice',
    ],
  },
  {
    id: 'batch-quinoa',
    name: 'Batch Cooked Quinoa',
    category: 'grains',
    prepTime: '5 min',
    cookTime: '20 min',
    yield: '6 servings',
    storageLife: '5 days fridge, 2 months freezer',
    difficulty: 'Easy',
    description: 'High-protein quinoa for salads, bowls, and breakfast.',
    whyItWorks: 'Quinoa is a complete protein and cooks quickly. Having it prepped means healthy meals are always accessible.',
    ingredients: [
      '2 cups quinoa',
      '3 cups water or broth',
      '1/2 tsp salt',
    ],
    steps: [
      'Rinse quinoa thoroughly in fine mesh strainer',
      'Toast in dry pan 2 minutes for nutty flavor (optional)',
      'Add liquid and salt, bring to boil',
      'Reduce heat, cover, simmer 15 minutes',
      'Remove from heat, let stand 5 minutes',
      'Fluff with fork and cool completely',
    ],
    variations: [
      { name: 'Herbed', seasonings: 'Cook in broth, add fresh herbs when fluffing' },
      { name: 'Mexican', seasonings: 'Add cumin, lime, cilantro' },
      { name: 'Mediterranean', seasonings: 'Add lemon zest, dill, olive oil' },
    ],
    usageIdeas: [
      'Buddha bowls',
      'Salads',
      'Breakfast porridge',
      'Stuffed vegetables',
      'Quinoa patties/burgers',
    ],
    proTips: [
      'Always rinse to remove bitter coating (saponins)',
      'Toasting adds nutty flavor',
      'Use broth instead of water for more flavor',
      'Fluff with fork, not spoon, to keep fluffy',
    ],
  },

  // VEGETABLES
  {
    id: 'roasted-vegetables',
    name: 'Sheet Pan Roasted Vegetables',
    category: 'vegetables',
    prepTime: '15 min',
    cookTime: '25-35 min',
    yield: '6-8 servings',
    storageLife: '5 days fridge',
    difficulty: 'Easy',
    description: 'Caramelized, flavorful vegetables ready for any meal.',
    whyItWorks: 'High-heat roasting caramelizes natural sugars and creates depth of flavor that steaming can\'t match. Batch roasting saves time and energy.',
    ingredients: [
      '2-3 lbs mixed vegetables (see variations)',
      '3 tbsp olive oil',
      '1 tsp salt',
      '1/2 tsp pepper',
      'Seasonings of choice',
    ],
    steps: [
      'Preheat oven to 425°F',
      'Cut vegetables into similar-sized pieces',
      'Toss with oil, salt, and seasonings',
      'Spread in single layer on sheet pans (don\'t crowd!)',
      'Roast 25-35 minutes, stirring halfway',
      'Vegetables should be caramelized and tender',
      'Cool and store',
    ],
    variations: [
      { name: 'Mediterranean', seasonings: 'Zucchini, bell peppers, onions, herbs de Provence' },
      { name: 'Asian', seasonings: 'Broccoli, snap peas, carrots, sesame oil' },
      { name: 'Fall Harvest', seasonings: 'Sweet potato, brussels sprouts, parsnips, maple' },
      { name: 'Mexican', seasonings: 'Peppers, onions, corn, cumin, chili' },
    ],
    usageIdeas: [
      'Grain bowls',
      'Pasta',
      'Frittatas and omelets',
      'Wraps',
      'Side dishes',
      'Soup base',
    ],
    proTips: [
      'Don\'t crowd the pan - causes steaming instead of roasting',
      'Group by cooking time (dense veggies take longer)',
      'Use two sheet pans if needed',
      'Line with parchment for easy cleanup',
    ],
  },
  {
    id: 'prepped-salad-greens',
    name: 'Prepped Salad Greens',
    category: 'vegetables',
    prepTime: '15 min',
    cookTime: '0 min',
    yield: '5-7 servings',
    storageLife: '5-7 days fridge',
    difficulty: 'Easy',
    description: 'Washed and stored greens ready for instant salads.',
    whyItWorks: 'Pre-washed greens remove the barrier to eating salads. Proper storage keeps them crisp all week.',
    ingredients: [
      '1-2 heads lettuce or mixed greens',
      'Paper towels',
      'Large container or salad spinner',
    ],
    steps: [
      'Separate leaves and discard wilted ones',
      'Fill sink or large bowl with cold water',
      'Submerge greens, swish gently',
      'Lift greens out (dirt sinks), repeat if needed',
      'Spin dry in salad spinner or pat with towels',
      'Layer in container: paper towel, greens, paper towel',
      'Store loosely covered in fridge',
    ],
    variations: [
      { name: 'Hearty Mix', seasonings: 'Kale, cabbage, brussels sprouts (massage kale)' },
      { name: 'Classic', seasonings: 'Romaine, iceberg, butter lettuce' },
      { name: 'Spring Mix', seasonings: 'Arugula, spinach, mixed baby greens' },
    ],
    usageIdeas: [
      'Quick lunch salads',
      'Dinner side salads',
      'Sandwich and wrap base',
      'Smoothie addition (spinach)',
    ],
    proTips: [
      'Dry thoroughly - moisture causes wilting',
      'Paper towels absorb excess moisture',
      'Don\'t cut or tear until ready to use',
      'Keep dressing separate until serving',
    ],
  },

  // SAUCES
  {
    id: 'versatile-sauce-base',
    name: 'Versatile Sauce Bases',
    category: 'sauces',
    prepTime: '10 min',
    cookTime: '10-15 min',
    yield: '2 cups',
    storageLife: '7-10 days fridge, 3 months freezer',
    difficulty: 'Medium',
    description: 'Master sauces that transform simple ingredients into complete meals.',
    whyItWorks: 'A good sauce turns plain protein and vegetables into a restaurant-quality meal. Having them ready makes cooking almost effortless.',
    ingredients: [
      'Base varies by sauce type',
      'See individual sauce recipes',
    ],
    steps: [
      'See individual sauce variations below',
    ],
    variations: [
      {
        name: 'Teriyaki Sauce',
        seasonings: '1/2 cup soy sauce, 1/4 cup mirin, 2 tbsp brown sugar, 1 tbsp ginger, 2 cloves garlic. Simmer until slightly thickened.'
      },
      {
        name: 'Peanut Sauce',
        seasonings: '1/2 cup peanut butter, 3 tbsp soy sauce, 2 tbsp lime juice, 1 tbsp honey, 1 tsp sriracha, thin with water.'
      },
      {
        name: 'Chimichurri',
        seasonings: '1 cup parsley, 1/4 cup oregano, 4 cloves garlic, 1/2 cup olive oil, 3 tbsp red wine vinegar, red pepper flakes.'
      },
      {
        name: 'Tahini Sauce',
        seasonings: '1/2 cup tahini, juice of 1 lemon, 2 cloves garlic, salt, thin with water until pourable.'
      },
      {
        name: 'Quick Marinara',
        seasonings: '28oz crushed tomatoes, 4 cloves garlic, 2 tbsp olive oil, basil, salt. Simmer 20 min.'
      },
    ],
    usageIdeas: [
      'Grain bowl drizzle',
      'Protein marinade',
      'Stir-fry sauce',
      'Dipping sauce',
      'Salad dressing base',
    ],
    proTips: [
      'Freeze in ice cube trays for portion control',
      'Label clearly with date',
      'Most sauces can be thinned when reheating',
      'Taste and adjust seasoning before storing',
    ],
  },
  {
    id: 'salad-dressings',
    name: 'Homemade Salad Dressings',
    category: 'sauces',
    prepTime: '5-10 min',
    cookTime: '0 min',
    yield: '1-2 cups',
    storageLife: '1-2 weeks fridge',
    difficulty: 'Easy',
    description: 'Shake-and-go dressings better than store-bought.',
    whyItWorks: 'Homemade dressings have no preservatives, better flavor, and cost a fraction of bottled. They encourage eating more salads.',
    ingredients: [
      'Basic ratio: 3 parts oil to 1 part acid',
      'Plus seasonings',
    ],
    steps: [
      'Combine all ingredients in jar with tight lid',
      'Shake vigorously until emulsified',
      'Taste and adjust seasonings',
      'Refrigerate',
      'Shake before each use (oil separates)',
    ],
    variations: [
      {
        name: 'Classic Vinaigrette',
        seasonings: '3/4 cup olive oil, 1/4 cup red wine vinegar, 1 tsp Dijon, 1 clove garlic minced, salt, pepper'
      },
      {
        name: 'Honey Mustard',
        seasonings: '1/2 cup olive oil, 3 tbsp Dijon, 2 tbsp honey, 2 tbsp apple cider vinegar'
      },
      {
        name: 'Caesar-Style',
        seasonings: '1/2 cup olive oil, 3 tbsp lemon juice, 2 tsp Worcestershire, 2 cloves garlic, Parmesan'
      },
      {
        name: 'Asian Sesame',
        seasonings: '1/4 cup sesame oil, 1/4 cup rice vinegar, 2 tbsp soy sauce, 1 tbsp honey, ginger'
      },
      {
        name: 'Ranch',
        seasonings: '1/2 cup mayo, 1/2 cup buttermilk, dill, chives, garlic powder, onion powder'
      },
    ],
    usageIdeas: [
      'Salads (obviously)',
      'Vegetable dip',
      'Marinade for proteins',
      'Drizzle on grain bowls',
      'Sandwich spread',
    ],
    proTips: [
      'Use a mason jar for shaking and storage',
      'Let garlic-based dressings sit 30 min before using',
      'Add Dijon mustard to help emulsify',
      'Make double batch - same effort, twice the yield',
    ],
  },

  // BREAKFAST
  {
    id: 'overnight-oats',
    name: 'Overnight Oats',
    category: 'breakfast',
    prepTime: '5 min per jar',
    cookTime: '0 min (overnight soak)',
    yield: '5 servings',
    storageLife: '5 days fridge',
    difficulty: 'Easy',
    description: 'Grab-and-go breakfasts that prep themselves while you sleep.',
    whyItWorks: 'The oats absorb liquid overnight, creating a creamy texture without cooking. Prep Sunday, eat all week.',
    ingredients: [
      '1/2 cup rolled oats per serving',
      '1/2 cup milk (any type)',
      '1/4 cup yogurt (optional, for creaminess)',
      '1 tbsp chia seeds (optional)',
      '1 tsp sweetener (honey, maple)',
      'Toppings of choice',
    ],
    steps: [
      'Add oats, milk, yogurt, chia seeds to jar',
      'Add sweetener and base flavorings',
      'Stir well, ensuring oats are submerged',
      'Seal and refrigerate overnight (at least 4 hours)',
      'Add fresh toppings before eating',
      'Eat cold or microwave if preferred',
    ],
    variations: [
      { name: 'PB&J', seasonings: '1 tbsp peanut butter, 2 tbsp jam, sliced bananas' },
      { name: 'Apple Pie', seasonings: 'Diced apple, cinnamon, maple syrup, walnuts' },
      { name: 'Tropical', seasonings: 'Coconut milk, mango, pineapple, toasted coconut' },
      { name: 'Chocolate Berry', seasonings: '1 tbsp cocoa, mixed berries, chocolate chips' },
      { name: 'Carrot Cake', seasonings: 'Shredded carrot, raisins, cinnamon, walnuts, cream cheese' },
    ],
    usageIdeas: [
      'Weekday breakfast',
      'Post-workout meal',
      'Healthy dessert',
      'Kids\' lunch option',
    ],
    proTips: [
      'Use wide-mouth jars for easy eating',
      'Steel cut oats don\'t work - use rolled/old-fashioned',
      'Add fresh fruit day-of to prevent sogginess',
      'Layer ingredients for prettier presentation',
    ],
  },
  {
    id: 'egg-muffins',
    name: 'Egg Muffin Cups',
    category: 'breakfast',
    prepTime: '15 min',
    cookTime: '20-25 min',
    yield: '12 muffins',
    storageLife: '5 days fridge, 2 months freezer',
    difficulty: 'Easy',
    description: 'Portable protein-packed breakfast ready in 30 seconds.',
    whyItWorks: 'Individual portions make it easy to grab a complete breakfast. High protein keeps you full until lunch.',
    ingredients: [
      '8 large eggs',
      '1/4 cup milk',
      '1 cup mix-ins (see variations)',
      'Salt and pepper',
      '1/2 cup cheese (optional)',
    ],
    steps: [
      'Preheat oven to 350°F',
      'Grease 12-cup muffin tin or use silicone liners',
      'Whisk eggs, milk, salt, and pepper',
      'Divide mix-ins evenly among cups',
      'Pour egg mixture over, filling 3/4 full',
      'Top with cheese if using',
      'Bake 20-25 minutes until set in center',
      'Cool before removing from pan',
    ],
    variations: [
      { name: 'Denver', seasonings: 'Ham, bell peppers, onions, cheddar' },
      { name: 'Mediterranean', seasonings: 'Spinach, sun-dried tomatoes, feta' },
      { name: 'Southwest', seasonings: 'Black beans, corn, jalapeño, pepper jack' },
      { name: 'Meat Lovers', seasonings: 'Bacon, sausage, cheddar' },
      { name: 'Veggie', seasonings: 'Broccoli, mushrooms, Swiss' },
    ],
    usageIdeas: [
      'Quick weekday breakfast',
      'Protein snack',
      'Lunch box addition',
      'Post-workout fuel',
    ],
    proTips: [
      'Silicone muffin cups release easiest',
      'Precook raw vegetables first',
      'Reheat from frozen: microwave 60-90 seconds',
      'Wrap individually for freezer',
    ],
  },

  // SNACKS
  {
    id: 'energy-bites',
    name: 'No-Bake Energy Bites',
    category: 'snacks',
    prepTime: '15 min',
    cookTime: '0 min + chill time',
    yield: '20-24 bites',
    storageLife: '1 week fridge, 3 months freezer',
    difficulty: 'Easy',
    description: 'Healthy snack balls for energy on the go.',
    whyItWorks: 'Combination of protein, healthy fats, and complex carbs provides sustained energy without a sugar crash.',
    ingredients: [
      '1 cup rolled oats',
      '1/2 cup nut butter',
      '1/3 cup honey or maple syrup',
      '1/2 cup mix-ins (chocolate chips, dried fruit, etc.)',
      '2 tbsp ground flaxseed (optional)',
      'Pinch of salt',
    ],
    steps: [
      'Combine all ingredients in large bowl',
      'Mix until well combined',
      'Refrigerate mixture 15-30 minutes if too sticky',
      'Roll into 1-inch balls',
      'Place on parchment-lined sheet',
      'Refrigerate until firm (30 minutes)',
      'Transfer to airtight container',
    ],
    variations: [
      { name: 'Chocolate Peanut Butter', seasonings: '2 tbsp cocoa, mini chocolate chips' },
      { name: 'Oatmeal Raisin', seasonings: 'Raisins, cinnamon, vanilla' },
      { name: 'Tropical', seasonings: 'Shredded coconut, dried mango, macadamia' },
      { name: 'Trail Mix', seasonings: 'Mixed nuts, dried cranberries, sunflower seeds' },
      { name: 'Birthday Cake', seasonings: 'Sprinkles, vanilla, almond butter' },
    ],
    usageIdeas: [
      'Mid-morning snack',
      'Pre-workout fuel',
      'Kids\' lunchbox',
      'Road trip snack',
      'Afternoon pick-me-up',
    ],
    proTips: [
      'Wet hands slightly to prevent sticking',
      'Use food processor for smoother texture',
      'Freeze flat in single layer first',
      'Adjust honey if nut butter is sweetened',
    ],
  },
  {
    id: 'hummus',
    name: 'Homemade Hummus',
    category: 'snacks',
    prepTime: '10 min',
    cookTime: '0 min',
    yield: '2 cups',
    storageLife: '7 days fridge',
    difficulty: 'Easy',
    description: 'Creamy, restaurant-quality hummus for snacking and meals.',
    whyItWorks: 'Homemade is significantly cheaper and fresher than store-bought, with no preservatives. Customize flavors endlessly.',
    ingredients: [
      '1 can (15oz) chickpeas, drained (reserve liquid)',
      '1/4 cup tahini',
      '3 tbsp lemon juice',
      '1-2 cloves garlic',
      '2 tbsp olive oil',
      '1/2 tsp cumin',
      'Salt to taste',
      '2-4 tbsp reserved chickpea liquid (aquafaba)',
    ],
    steps: [
      'Add tahini and lemon juice to food processor, blend 1 minute',
      'Add olive oil, garlic, cumin, salt - blend 30 seconds',
      'Add chickpeas and blend until smooth, scraping sides',
      'With processor running, slowly add aquafaba until desired consistency',
      'Taste and adjust lemon, salt, garlic',
      'Transfer to container, drizzle with olive oil',
    ],
    variations: [
      { name: 'Roasted Garlic', seasonings: 'Use 1 whole head roasted garlic instead of raw' },
      { name: 'Red Pepper', seasonings: 'Add 1/2 cup roasted red peppers' },
      { name: 'Spicy', seasonings: 'Add sriracha or harissa to taste' },
      { name: 'Everything Bagel', seasonings: 'Top with everything bagel seasoning' },
      { name: 'Avocado', seasonings: 'Add 1 ripe avocado' },
    ],
    usageIdeas: [
      'Vegetable dip',
      'Sandwich spread',
      'Grain bowl base',
      'Wrap filling',
      'Toast topper',
    ],
    proTips: [
      'Blend tahini and lemon first for creamier texture',
      'Removing chickpea skins makes it silkier',
      'Use aquafaba (chickpea liquid) for smoothness',
      'Let it sit 30 min for flavors to meld',
    ],
  },
]

// Meal Prep Strategies
export const PREP_STRATEGIES = [
  {
    id: 'batch-cooking',
    title: 'Batch Cooking',
    icon: '🍳',
    description: 'Cook large quantities of base ingredients at once',
    tips: [
      'Dedicate 2-3 hours on Sunday to prep',
      'Cook 2-3 proteins, 2-3 grains, lots of vegetables',
      'Focus on versatile ingredients that work in multiple dishes',
      'Use the oven for hands-off cooking',
    ],
  },
  {
    id: 'component-prep',
    title: 'Component Prep',
    icon: '📦',
    description: 'Prepare ingredients separately for mix-and-match meals',
    tips: [
      'Wash and chop vegetables in advance',
      'Make sauces and dressings',
      'Cook grains and proteins separately',
      'Assemble meals fresh each day',
    ],
  },
  {
    id: 'freezer-prep',
    title: 'Freezer Meals',
    icon: '❄️',
    description: 'Prepare complete meals for long-term storage',
    tips: [
      'Double recipes and freeze half',
      'Use freezer-safe containers',
      'Label everything with date and contents',
      'Thaw in fridge overnight before reheating',
    ],
  },
  {
    id: 'grab-and-go',
    title: 'Grab and Go',
    icon: '🏃',
    description: 'Portion meals into individual containers',
    tips: [
      'Invest in quality meal prep containers',
      'Keep dressings separate until eating',
      'Layer strategically (greens on top)',
      'Prepare 4-5 days at a time max',
    ],
  },
]

// Helper functions
export function getGuidesByCategory(categoryId) {
  return PREP_GUIDES.filter(g => g.category === categoryId)
}

export function searchGuides(query) {
  const q = query.toLowerCase()
  return PREP_GUIDES.filter(g =>
    g.name.toLowerCase().includes(q) ||
    g.description.toLowerCase().includes(q) ||
    g.usageIdeas.some(idea => idea.toLowerCase().includes(q))
  )
}

export function getGuideById(id) {
  return PREP_GUIDES.find(g => g.id === id)
}
