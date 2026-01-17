// Cooking Technique Library

export const TECHNIQUE_CATEGORIES = [
  { id: 'knife', label: 'Knife Skills', icon: '🔪', color: 'red' },
  { id: 'heat', label: 'Heat & Cooking', icon: '🔥', color: 'orange' },
  { id: 'baking', label: 'Baking', icon: '🥐', color: 'amber' },
  { id: 'sauce', label: 'Sauces & Emulsions', icon: '🥣', color: 'yellow' },
  { id: 'prep', label: 'Prep Techniques', icon: '🥗', color: 'green' },
  { id: 'advanced', label: 'Advanced', icon: '👨‍🍳', color: 'purple' },
]

export const TECHNIQUES = [
  // KNIFE SKILLS
  {
    id: 'julienne',
    name: 'Julienne',
    category: 'knife',
    difficulty: 2,
    description: 'Cutting vegetables into thin, uniform matchstick strips about 1/8 inch thick and 2-3 inches long.',
    usedFor: ['Stir-fries', 'Salads', 'Garnishes', 'Spring rolls'],
    recipeSearchTerms: ['stir fry', 'salad', 'spring rolls'],
    steps: [
      'Start with a peeled vegetable (carrot, zucchini, etc.)',
      'Cut off the ends and square off the sides to create a rectangular block',
      'Cut the block into 1/8 inch thick planks lengthwise',
      'Stack 2-3 planks and cut into 1/8 inch strips',
      'Aim for uniform 2-3 inch matchsticks'
    ],
    tips: [
      'Keep your fingers curled (claw grip) for safety',
      'Use a sharp knife - dull knives slip and cause injuries',
      'Work slowly until you build confidence',
      'Cold vegetables are easier to cut precisely'
    ],
    videoKeywords: 'how to julienne vegetables',
    relatedTechniques: ['brunoise', 'chiffonade', 'batonnet']
  },
  {
    id: 'brunoise',
    name: 'Brunoise',
    category: 'knife',
    difficulty: 3,
    description: 'A fine dice measuring 1/8 inch cubes. Start with julienne strips, then cut crosswise into tiny cubes.',
    usedFor: ['Mirepoix', 'Consommé garnish', 'Salsas', 'Fine sauces'],
    recipeSearchTerms: ['soup', 'salsa', 'french'],
    steps: [
      'First, julienne your vegetable into 1/8 inch strips',
      'Gather the julienne strips together',
      'Hold them firmly with your claw grip',
      'Cut crosswise into 1/8 inch pieces',
      'You should have uniform tiny cubes'
    ],
    tips: [
      'Master julienne first before attempting brunoise',
      'A mandoline can help achieve uniform julienne',
      'Keep your cutting board stable with a damp towel underneath',
      'Practice with carrots - they hold their shape well'
    ],
    videoKeywords: 'brunoise cut technique',
    relatedTechniques: ['julienne', 'small dice', 'mince']
  },
  {
    id: 'chiffonade',
    name: 'Chiffonade',
    category: 'knife',
    difficulty: 1,
    description: 'Rolling leafy herbs or greens and slicing into thin ribbons. Perfect for basil, mint, and lettuce.',
    usedFor: ['Garnishes', 'Salads', 'Pasta toppings', 'Soups'],
    recipeSearchTerms: ['pasta', 'salad', 'italian'],
    steps: [
      'Stack clean, dry leaves on top of each other',
      'Roll the stack tightly into a cigar shape',
      'Hold the roll firmly with your claw grip',
      'Slice crosswise into thin ribbons (1/8 to 1/4 inch)',
      'Gently separate the ribbons with your fingers'
    ],
    tips: [
      'Don\'t chop back and forth - use one clean motion per slice',
      'Works best with larger leaves like basil or spinach',
      'Cut just before serving to prevent browning',
      'A sharp knife prevents bruising delicate herbs'
    ],
    videoKeywords: 'chiffonade basil technique',
    relatedTechniques: ['julienne', 'mince']
  },
  {
    id: 'mince',
    name: 'Mince',
    category: 'knife',
    difficulty: 1,
    description: 'Cutting ingredients into very small, irregular pieces smaller than a dice but not as fine as a paste.',
    usedFor: ['Garlic', 'Ginger', 'Herbs', 'Aromatics'],
    recipeSearchTerms: ['garlic', 'chicken', 'curry'],
    steps: [
      'First, roughly chop the ingredient',
      'Keep the tip of the knife on the cutting board',
      'Rock the blade back and forth over the ingredients',
      'Use your other hand on top of the blade for control',
      'Continue until pieces are very small (1/16 inch or less)'
    ],
    tips: [
      'Sprinkle salt on garlic while mincing to prevent sticking',
      'A wider chef\'s knife works better for mincing',
      'Don\'t mince too far ahead - aromatics lose flavor',
      'For garlic, smash with the flat of your knife first'
    ],
    videoKeywords: 'how to mince garlic properly',
    relatedTechniques: ['brunoise', 'chop', 'crush']
  },
  {
    id: 'batonnet',
    name: 'Batonnet',
    category: 'knife',
    difficulty: 2,
    description: 'Cutting vegetables into stick shapes 1/4 inch x 1/4 inch x 2-3 inches. Larger than julienne.',
    usedFor: ['French fries', 'Crudités', 'Stir-fries', 'Roasting'],
    recipeSearchTerms: ['fries', 'roasted', 'vegetable'],
    steps: [
      'Square off your vegetable into a rectangular block',
      'Cut lengthwise into 1/4 inch thick planks',
      'Stack planks and cut into 1/4 inch strips',
      'Cut strips to 2-3 inch lengths if needed'
    ],
    tips: [
      'This is the base cut for medium dice and French fries',
      'Great practice cut for building knife skills',
      'Perfect for carrot and celery sticks',
      'Consistent size ensures even cooking'
    ],
    videoKeywords: 'batonnet cut vegetables',
    relatedTechniques: ['julienne', 'french fry cut', 'medium dice']
  },

  // HEAT & COOKING
  {
    id: 'saute',
    name: 'Sauté',
    category: 'heat',
    difficulty: 1,
    description: 'Cooking food quickly in a small amount of fat over relatively high heat while stirring or tossing.',
    usedFor: ['Vegetables', 'Thin cuts of meat', 'Shrimp', 'Mushrooms'],
    recipeSearchTerms: ['chicken', 'shrimp', 'mushroom'],
    steps: [
      'Heat your pan over medium-high heat',
      'Add a small amount of oil or butter',
      'Wait until the fat shimmers or butter stops foaming',
      'Add ingredients in a single layer - don\'t crowd',
      'Toss or stir frequently to cook evenly'
    ],
    tips: [
      'The word means "to jump" - keep things moving',
      'Dry ingredients thoroughly to prevent steaming',
      'Don\'t overcrowd - work in batches if needed',
      'Have all ingredients prepped before you start'
    ],
    videoKeywords: 'how to saute properly',
    relatedTechniques: ['stir-fry', 'pan-fry', 'sear']
  },
  {
    id: 'sear',
    name: 'Sear',
    category: 'heat',
    difficulty: 2,
    description: 'Cooking the surface of food at high temperature to create a flavorful brown crust through the Maillard reaction.',
    usedFor: ['Steaks', 'Chops', 'Fish fillets', 'Scallops'],
    recipeSearchTerms: ['steak', 'salmon', 'tuna'],
    steps: [
      'Pat meat completely dry with paper towels',
      'Season generously with salt and pepper',
      'Heat pan until very hot - almost smoking',
      'Add oil with high smoke point',
      'Place meat in pan and DON\'T MOVE IT',
      'Wait 2-4 minutes until it releases easily, then flip'
    ],
    tips: [
      'Meat should sizzle loudly when it hits the pan',
      'If it sticks, it\'s not ready to flip yet',
      'Let meat rest before slicing to retain juices',
      'A cast iron pan holds heat best for searing'
    ],
    videoKeywords: 'how to sear steak perfectly',
    relatedTechniques: ['reverse sear', 'pan-fry', 'blacken']
  },
  {
    id: 'braise',
    name: 'Braise',
    category: 'heat',
    difficulty: 2,
    description: 'Slow-cooking tough cuts in liquid at low temperature to break down collagen and create tender, flavorful results.',
    usedFor: ['Pot roast', 'Short ribs', 'Lamb shanks', 'Chicken thighs'],
    recipeSearchTerms: ['beef', 'lamb', 'stew'],
    steps: [
      'Season and sear the meat on all sides',
      'Remove meat and sauté aromatics (onion, carrot, celery)',
      'Deglaze with wine or stock, scraping up brown bits',
      'Return meat and add liquid to come 1/3 to 1/2 up the meat',
      'Cover and cook low and slow (300°F) for 2-4 hours',
      'Meat is done when fork-tender'
    ],
    tips: [
      'Tough, cheap cuts are ideal - they become luxurious',
      'Don\'t submerge meat completely - it should not boil',
      'The braising liquid becomes your sauce',
      'Even better the next day as flavors meld'
    ],
    videoKeywords: 'braising technique explained',
    relatedTechniques: ['stew', 'pot roast', 'confit']
  },
  {
    id: 'poach',
    name: 'Poach',
    category: 'heat',
    difficulty: 2,
    description: 'Gently cooking food submerged in liquid held just below boiling (160-180°F). No bubbles should break the surface.',
    usedFor: ['Eggs', 'Chicken breast', 'Fish', 'Fruit'],
    recipeSearchTerms: ['egg', 'salmon', 'pear'],
    steps: [
      'Bring liquid (water, stock, wine) to a bare simmer',
      'Temperature should be 160-180°F - tiny bubbles on bottom',
      'Gently lower food into liquid',
      'Maintain gentle heat - no rolling bubbles',
      'Cook until just done - don\'t overcook'
    ],
    tips: [
      'Add vinegar to water when poaching eggs',
      'Create a gentle whirlpool before adding eggs',
      'Poaching keeps delicate foods moist',
      'Strain poaching liquid for a quick sauce'
    ],
    videoKeywords: 'how to poach eggs perfectly',
    relatedTechniques: ['simmer', 'sous vide', 'steam']
  },
  {
    id: 'deglaze',
    name: 'Deglaze',
    category: 'heat',
    difficulty: 1,
    description: 'Adding liquid to a hot pan to dissolve the caramelized bits (fond) stuck to the bottom after cooking meat.',
    usedFor: ['Pan sauces', 'Gravies', 'Braises', 'Risotto'],
    recipeSearchTerms: ['chicken', 'pork', 'risotto'],
    steps: [
      'After searing meat, remove it from the pan',
      'Keep the pan hot over medium-high heat',
      'Add liquid (wine, stock, or even water)',
      'It will sizzle and steam - be careful',
      'Scrape the bottom with a wooden spoon',
      'Reduce liquid by half for concentrated flavor'
    ],
    tips: [
      'The brown bits are flavor gold - don\'t wash them away',
      'Stand back when adding liquid - it splatters',
      'Wine adds acidity and depth',
      'This is the base for any quick pan sauce'
    ],
    videoKeywords: 'how to deglaze a pan',
    relatedTechniques: ['reduce', 'pan sauce', 'fond']
  },
  {
    id: 'reduce',
    name: 'Reduce',
    category: 'heat',
    difficulty: 1,
    description: 'Simmering a liquid to evaporate water, concentrating flavors and thickening consistency.',
    usedFor: ['Sauces', 'Stocks', 'Glazes', 'Balsamic reduction'],
    recipeSearchTerms: ['sauce', 'glaze', 'teriyaki'],
    steps: [
      'Bring liquid to a simmer in a wide pan',
      'Keep at active simmer - small bubbles breaking surface',
      'Don\'t stir unless it starts to stick',
      'Watch carefully as it thickens',
      'Test consistency - it should coat a spoon'
    ],
    tips: [
      'A wider pan reduces faster due to more surface area',
      'Taste as you go - flavors concentrate including salt',
      'Reduction continues even after removing from heat',
      'Can\'t un-reduce - always under-reduce slightly'
    ],
    videoKeywords: 'how to reduce sauce',
    relatedTechniques: ['deglaze', 'simmer', 'glaze']
  },
  {
    id: 'blanch',
    name: 'Blanch',
    category: 'heat',
    difficulty: 1,
    description: 'Briefly cooking food in boiling water, then immediately plunging into ice water to stop cooking.',
    usedFor: ['Green vegetables', 'Tomato peeling', 'Prepping for freezing', 'Par-cooking'],
    recipeSearchTerms: ['vegetable', 'broccoli', 'green beans'],
    steps: [
      'Bring a large pot of salted water to rolling boil',
      'Prepare an ice bath in a large bowl',
      'Add vegetables to boiling water',
      'Cook briefly - 30 seconds to 2 minutes depending on item',
      'Immediately transfer to ice bath',
      'Once cold, remove and drain well'
    ],
    tips: [
      'Use plenty of water so temperature doesn\'t drop too much',
      'Salt water generously like the sea',
      'The ice bath is essential - don\'t skip it',
      'Vegetables should be bright green and crisp-tender'
    ],
    videoKeywords: 'blanching vegetables technique',
    relatedTechniques: ['shock', 'parboil', 'par-cook']
  },

  // BAKING
  {
    id: 'temper-chocolate',
    name: 'Temper Chocolate',
    category: 'baking',
    difficulty: 4,
    description: 'Heating and cooling chocolate to specific temperatures to create a glossy finish and satisfying snap.',
    usedFor: ['Chocolate coating', 'Truffles', 'Molded chocolates', 'Decorations'],
    recipeSearchTerms: ['chocolate', 'brownie', 'dessert'],
    steps: [
      'Finely chop chocolate (use quality chocolate with cocoa butter)',
      'Melt 2/3 of chocolate over double boiler to 115°F (dark) or 105°F (milk)',
      'Remove from heat and add remaining chopped chocolate',
      'Stir constantly until temperature drops to 82°F',
      'Briefly rewarm to 88-90°F (dark) or 86-88°F (milk)',
      'Test by dipping a knife - should set shiny in 5 minutes'
    ],
    tips: [
      'Use a digital thermometer - precision matters',
      'No water can touch the chocolate - it will seize',
      'Work in a cool room (65-68°F)',
      'Tempered chocolate snaps when broken'
    ],
    videoKeywords: 'how to temper chocolate',
    relatedTechniques: ['melt chocolate', 'ganache', 'chocolate work']
  },
  {
    id: 'fold',
    name: 'Fold',
    category: 'baking',
    difficulty: 2,
    description: 'Gently combining a light mixture (whipped eggs/cream) with a heavier one while preserving air and volume.',
    usedFor: ['Soufflés', 'Mousse', 'Angel food cake', 'Macarons'],
    recipeSearchTerms: ['souffle', 'mousse', 'cake'],
    steps: [
      'Add lighter mixture on top of heavier mixture',
      'Cut down through center with spatula',
      'Sweep along bottom of bowl',
      'Fold up and over the mixture',
      'Rotate bowl 90° and repeat',
      'Continue until just combined - some streaks are OK'
    ],
    tips: [
      'Never stir or whip - you\'ll deflate the mixture',
      'Work quickly but gently',
      'Under-mixing is better than over-mixing',
      'Use a large, flexible silicone spatula'
    ],
    videoKeywords: 'how to fold batter properly',
    relatedTechniques: ['whip', 'cream', 'meringue']
  },
  {
    id: 'cream-butter',
    name: 'Cream Butter',
    category: 'baking',
    difficulty: 1,
    description: 'Beating softened butter with sugar until light, fluffy, and pale. Creates air pockets for tender baked goods.',
    usedFor: ['Cakes', 'Cookies', 'Buttercream', 'Quick breads'],
    recipeSearchTerms: ['cookies', 'cake', 'banana bread'],
    steps: [
      'Start with room temperature butter (65-67°F)',
      'Beat butter alone for 30 seconds until smooth',
      'Gradually add sugar while beating',
      'Beat on medium-high for 3-5 minutes',
      'Mixture should be pale, fluffy, and doubled in volume',
      'Scrape bowl occasionally to ensure even mixing'
    ],
    tips: [
      'Butter should dent when pressed but not be greasy',
      'Don\'t rush - proper creaming takes 3-5 minutes',
      'The color will go from yellow to almost white',
      'This step creates the texture of your final product'
    ],
    videoKeywords: 'creaming butter and sugar technique',
    relatedTechniques: ['fold', 'whip', 'beat']
  },
  {
    id: 'proof-yeast',
    name: 'Proof Yeast',
    category: 'baking',
    difficulty: 1,
    description: 'Testing active dry yeast to ensure it\'s alive before adding to dough, and allowing dough to rise.',
    usedFor: ['Bread', 'Pizza dough', 'Cinnamon rolls', 'Donuts'],
    recipeSearchTerms: ['bread', 'pizza', 'rolls'],
    steps: [
      'Warm water to 105-110°F (warm but not hot to touch)',
      'Dissolve a pinch of sugar in the water',
      'Sprinkle yeast over surface - don\'t stir yet',
      'Wait 5-10 minutes',
      'Yeast should foam and bubble - it\'s alive!',
      'If no activity after 10 min, yeast is dead - discard'
    ],
    tips: [
      'Too hot water kills yeast; too cold won\'t activate it',
      'Instant yeast doesn\'t need proofing',
      'Sugar feeds the yeast and speeds activation',
      'Store yeast in freezer for longest life'
    ],
    videoKeywords: 'how to proof yeast',
    relatedTechniques: ['knead', 'ferment', 'rise']
  },
  {
    id: 'knead',
    name: 'Knead',
    category: 'baking',
    difficulty: 2,
    description: 'Working dough by hand or machine to develop gluten structure, creating elasticity and strength.',
    usedFor: ['Bread', 'Pizza', 'Pasta', 'Bagels'],
    recipeSearchTerms: ['bread', 'pizza', 'pasta'],
    steps: [
      'Turn dough onto lightly floured surface',
      'Push dough away from you with heel of hand',
      'Fold the far edge toward you',
      'Rotate dough 90 degrees',
      'Repeat push-fold-turn for 8-10 minutes',
      'Dough is ready when smooth and springs back when poked'
    ],
    tips: [
      'Don\'t add too much flour - sticky is often correct',
      'Let dough rest 5 min if it resists stretching',
      'Windowpane test: stretch dough thin - should be translucent',
      'Hand kneading takes 10-12 min; mixer 6-8 min'
    ],
    videoKeywords: 'how to knead bread dough',
    relatedTechniques: ['proof', 'fold', 'shape']
  },

  // SAUCES & EMULSIONS
  {
    id: 'emulsify',
    name: 'Emulsify',
    category: 'sauce',
    difficulty: 3,
    description: 'Combining two liquids that don\'t normally mix (oil and water/vinegar) into a stable, creamy mixture.',
    usedFor: ['Mayonnaise', 'Vinaigrette', 'Hollandaise', 'Caesar dressing'],
    recipeSearchTerms: ['salad', 'dressing', 'aioli'],
    steps: [
      'Start with your water-based ingredient (egg yolk, mustard, vinegar)',
      'Add oil VERY slowly - drop by drop at first',
      'Whisk constantly and vigorously',
      'Once it starts to thicken, you can add oil faster',
      'Continue until all oil is incorporated',
      'Season to taste'
    ],
    tips: [
      'Room temperature ingredients emulsify better',
      'Mustard and egg yolk are natural emulsifiers',
      'If it breaks, start fresh with new yolk and slowly whisk in broken sauce',
      'A blender makes this much easier'
    ],
    videoKeywords: 'how to emulsify mayonnaise',
    relatedTechniques: ['whisk', 'mount', 'vinaigrette']
  },
  {
    id: 'mount-butter',
    name: 'Mount with Butter',
    category: 'sauce',
    difficulty: 2,
    description: 'Whisking cold butter into a sauce to add richness, gloss, and create a silky emulsion.',
    usedFor: ['Pan sauces', 'Beurre blanc', 'Finishing sauces', 'Risotto'],
    recipeSearchTerms: ['risotto', 'fish', 'french'],
    steps: [
      'Have your sauce reduced and off direct heat',
      'Cut cold butter into small cubes',
      'Add butter a few pieces at a time',
      'Whisk constantly until incorporated',
      'Sauce should become glossy and slightly thickened',
      'Serve immediately - don\'t reheat or it will break'
    ],
    tips: [
      'Cold butter is essential - it emulsifies as it melts',
      'Don\'t boil after adding butter',
      'A little acid (lemon) helps stabilize',
      'This is how restaurants make sauces luxurious'
    ],
    videoKeywords: 'mounting sauce with butter',
    relatedTechniques: ['emulsify', 'beurre blanc', 'pan sauce']
  },
  {
    id: 'roux',
    name: 'Make a Roux',
    category: 'sauce',
    difficulty: 1,
    description: 'Cooking equal parts flour and fat together to create a thickening base for sauces, gravies, and soups.',
    usedFor: ['Béchamel', 'Gravy', 'Gumbo', 'Mac and cheese'],
    recipeSearchTerms: ['mac and cheese', 'lasagne', 'soup'],
    steps: [
      'Melt butter in a saucepan over medium heat',
      'Add equal amount of flour (by weight is most accurate)',
      'Whisk constantly to prevent lumps',
      'Cook to desired color: white (2 min), blonde (5 min), brown (10-15 min)',
      'Gradually whisk in liquid off heat to prevent lumps',
      'Return to heat and simmer until thickened'
    ],
    tips: [
      'Darker roux = more flavor but less thickening power',
      'Add hot liquid to hot roux, or cold to cold',
      'One tablespoon roux thickens one cup liquid',
      'Stir constantly for dark roux to prevent burning'
    ],
    videoKeywords: 'how to make roux',
    relatedTechniques: ['béchamel', 'velouté', 'gumbo']
  },

  // PREP TECHNIQUES
  {
    id: 'marinate',
    name: 'Marinate',
    category: 'prep',
    difficulty: 1,
    description: 'Soaking food in a seasoned liquid to add flavor and, in some cases, tenderize.',
    usedFor: ['Grilled meats', 'Kebabs', 'Tofu', 'Vegetables'],
    recipeSearchTerms: ['kebab', 'chicken', 'teriyaki'],
    steps: [
      'Combine acid (citrus, vinegar), oil, and seasonings',
      'Place food in non-reactive container (glass, plastic)',
      'Pour marinade over food, ensuring it\'s coated',
      'Cover and refrigerate',
      'Turn occasionally for even flavor',
      'Pat dry before cooking for better browning'
    ],
    tips: [
      'Acid breaks down protein - don\'t over-marinate (fish: 30 min max)',
      'Beef can marinate 24 hours; chicken 2-4 hours',
      'Never reuse marinade that touched raw meat',
      'Reserve some marinade before adding meat for serving'
    ],
    videoKeywords: 'how to marinate meat',
    relatedTechniques: ['brine', 'cure', 'tenderize']
  },
  {
    id: 'brine',
    name: 'Brine',
    category: 'prep',
    difficulty: 1,
    description: 'Soaking food in salt water solution to increase moisture retention and season throughout.',
    usedFor: ['Turkey', 'Pork chops', 'Chicken', 'Pickles'],
    recipeSearchTerms: ['turkey', 'pork', 'roast chicken'],
    steps: [
      'Dissolve salt in water (basic ratio: 1 cup salt per gallon water)',
      'Add aromatics if desired (peppercorns, herbs, garlic)',
      'Cool brine completely before adding meat',
      'Submerge meat fully in brine',
      'Refrigerate for recommended time',
      'Rinse and pat dry before cooking'
    ],
    tips: [
      'Use kosher or sea salt - table salt is too fine',
      'Chicken: 1-2 hours; Turkey: 12-24 hours',
      'Don\'t brine pre-brined/kosher meats',
      'Dry brining (salt rub) works too and takes less space'
    ],
    videoKeywords: 'how to brine chicken',
    relatedTechniques: ['marinate', 'cure', 'season']
  },
  {
    id: 'mise-en-place',
    name: 'Mise en Place',
    category: 'prep',
    difficulty: 1,
    description: 'French for "everything in its place." Preparing and organizing all ingredients before cooking begins.',
    usedFor: ['Every recipe', 'Professional cooking', 'Meal prep', 'Efficient cooking'],
    recipeSearchTerms: ['stir fry', 'curry', 'pasta'],
    steps: [
      'Read the entire recipe first',
      'Gather all ingredients',
      'Measure everything needed',
      'Complete all prep work (chopping, mincing, etc.)',
      'Arrange in order of use',
      'Have tools and equipment ready'
    ],
    tips: [
      'This is the #1 habit of professional chefs',
      'Prevents forgetting ingredients or steps',
      'Makes cooking less stressful and more enjoyable',
      'Clean as you go for efficiency'
    ],
    videoKeywords: 'mise en place explained',
    relatedTechniques: ['prep', 'organization', 'planning']
  },

  // ADVANCED
  {
    id: 'sous-vide',
    name: 'Sous Vide',
    category: 'advanced',
    difficulty: 3,
    description: 'Cooking vacuum-sealed food in a precisely controlled water bath for perfect, edge-to-edge doneness.',
    usedFor: ['Steaks', 'Chicken breast', 'Eggs', 'Vegetables'],
    recipeSearchTerms: ['steak', 'chicken breast', 'salmon'],
    steps: [
      'Season food and seal in vacuum bag or use water displacement method',
      'Set immersion circulator to target temperature',
      'Once water reaches temp, add bagged food',
      'Cook for recommended time (1-48+ hours depending on food)',
      'Remove from bag and pat dry',
      'Sear briefly for color and crust (optional but recommended)'
    ],
    tips: [
      'Can\'t overcook if time is reasonable - temp is exact',
      'Steak at 130°F for perfect medium-rare edge to edge',
      'Searing after is essential for texture',
      'Great for meal prep - cook ahead and sear to serve'
    ],
    videoKeywords: 'sous vide cooking guide',
    relatedTechniques: ['sear', 'vacuum seal', 'precision cooking']
  },
  {
    id: 'confit',
    name: 'Confit',
    category: 'advanced',
    difficulty: 3,
    description: 'Slowly cooking food submerged in fat at low temperature, traditionally for preservation and incredible tenderness.',
    usedFor: ['Duck legs', 'Garlic', 'Tomatoes', 'Pork'],
    recipeSearchTerms: ['duck', 'garlic', 'french'],
    steps: [
      'Season meat heavily with salt, cure 24-48 hours',
      'Rinse and pat dry',
      'Submerge completely in fat (duck fat, olive oil)',
      'Cook at low temp (200-275°F) for 2-6 hours',
      'Meat should be fall-off-the-bone tender',
      'Can store submerged in fat for weeks refrigerated'
    ],
    tips: [
      'The salt cure is essential for flavor and texture',
      'Fat can be strained and reused',
      'Crisp the skin after confiting for best texture',
      'Confit garlic is spreadable and sweet'
    ],
    videoKeywords: 'duck confit technique',
    relatedTechniques: ['braise', 'cure', 'slow cook']
  },
  {
    id: 'flambe',
    name: 'Flambé',
    category: 'advanced',
    difficulty: 4,
    description: 'Igniting alcohol in a pan to burn off alcohol while adding caramelized flavor.',
    usedFor: ['Bananas Foster', 'Steak Diane', 'Cherries Jubilee', 'Crêpes Suzette'],
    recipeSearchTerms: ['banana', 'crepes', 'steak'],
    steps: [
      'Have everything ready - this happens fast',
      'Remove pan from heat before adding alcohol',
      'Add alcohol (brandy, rum, etc.)',
      'Return to heat and tilt pan to ignite, or use long lighter',
      'Stand back - flames can be high',
      'Gently swirl pan until flames die down'
    ],
    tips: [
      'Never pour from the bottle near flame',
      'Tie back hair and roll up sleeves',
      'Have a lid nearby to smother if needed',
      'The alcohol burns off, leaving complex flavor'
    ],
    videoKeywords: 'how to flambe safely',
    relatedTechniques: ['deglaze', 'caramelize', 'sauté']
  },
  {
    id: 'caramelize',
    name: 'Caramelize',
    category: 'advanced',
    difficulty: 2,
    description: 'Heating sugar until it melts and turns golden brown, developing complex flavors.',
    usedFor: ['Crème brûlée', 'Caramel sauce', 'Onions', 'Flan'],
    recipeSearchTerms: ['creme brulee', 'flan', 'caramel'],
    steps: [
      'Add sugar to a clean, dry pan',
      'Heat over medium heat without stirring',
      'Watch carefully as edges start to melt',
      'Gently swirl pan to distribute heat',
      'Continue until desired amber color',
      'Remove immediately - it continues cooking'
    ],
    tips: [
      'Don\'t stir or sugar will crystallize',
      'One grain of undissolved sugar can cause crystallization',
      'Wet method (with water) is more forgiving',
      'Dark caramel = bitter; light = sweeter'
    ],
    videoKeywords: 'how to caramelize sugar',
    relatedTechniques: ['torch', 'candy making', 'burnt sugar']
  },
]

// Helper function to get techniques by category
export function getTechniquesByCategory(categoryId) {
  return TECHNIQUES.filter(t => t.category === categoryId)
}

// Helper function to search techniques
export function searchTechniques(query) {
  const lower = query.toLowerCase()
  return TECHNIQUES.filter(t =>
    t.name.toLowerCase().includes(lower) ||
    t.description.toLowerCase().includes(lower) ||
    t.usedFor.some(u => u.toLowerCase().includes(lower))
  )
}

// Get related techniques
export function getRelatedTechniques(techniqueId) {
  const technique = TECHNIQUES.find(t => t.id === techniqueId)
  if (!technique) return []

  return technique.relatedTechniques
    .map(id => TECHNIQUES.find(t => t.id === id))
    .filter(Boolean)
}
