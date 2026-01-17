import { useState, useMemo } from 'react'

// Conversion data
const CONVERSION_CATEGORIES = [
  { id: 'volume', label: 'Volume', icon: '🥛' },
  { id: 'weight', label: 'Weight', icon: '⚖️' },
  { id: 'temperature', label: 'Temperature', icon: '🌡️' },
  { id: 'length', label: 'Length', icon: '📏' },
]

const VOLUME_UNITS = [
  { id: 'tsp', label: 'Teaspoons (tsp)', toMl: 4.929 },
  { id: 'tbsp', label: 'Tablespoons (tbsp)', toMl: 14.787 },
  { id: 'fl_oz', label: 'Fluid Ounces (fl oz)', toMl: 29.574 },
  { id: 'cup', label: 'Cups', toMl: 236.588 },
  { id: 'pint', label: 'Pints', toMl: 473.176 },
  { id: 'quart', label: 'Quarts', toMl: 946.353 },
  { id: 'gallon', label: 'Gallons', toMl: 3785.41 },
  { id: 'ml', label: 'Milliliters (ml)', toMl: 1 },
  { id: 'liter', label: 'Liters (L)', toMl: 1000 },
]

const WEIGHT_UNITS = [
  { id: 'oz', label: 'Ounces (oz)', toGram: 28.3495 },
  { id: 'lb', label: 'Pounds (lb)', toGram: 453.592 },
  { id: 'gram', label: 'Grams (g)', toGram: 1 },
  { id: 'kg', label: 'Kilograms (kg)', toGram: 1000 },
]

const LENGTH_UNITS = [
  { id: 'inch', label: 'Inches (in)', toCm: 2.54 },
  { id: 'cm', label: 'Centimeters (cm)', toCm: 1 },
  { id: 'mm', label: 'Millimeters (mm)', toCm: 0.1 },
]

// Common ingredient density for volume-to-weight conversions (g per cup)
const INGREDIENT_DENSITIES = [
  { id: 'flour_ap', name: 'All-Purpose Flour', gramsPerCup: 125 },
  { id: 'flour_bread', name: 'Bread Flour', gramsPerCup: 127 },
  { id: 'flour_cake', name: 'Cake Flour', gramsPerCup: 114 },
  { id: 'flour_whole', name: 'Whole Wheat Flour', gramsPerCup: 120 },
  { id: 'sugar_white', name: 'White Sugar', gramsPerCup: 200 },
  { id: 'sugar_brown', name: 'Brown Sugar (packed)', gramsPerCup: 220 },
  { id: 'sugar_powder', name: 'Powdered Sugar', gramsPerCup: 120 },
  { id: 'butter', name: 'Butter', gramsPerCup: 227 },
  { id: 'oil', name: 'Oil (vegetable)', gramsPerCup: 218 },
  { id: 'honey', name: 'Honey', gramsPerCup: 340 },
  { id: 'maple_syrup', name: 'Maple Syrup', gramsPerCup: 312 },
  { id: 'milk', name: 'Milk', gramsPerCup: 244 },
  { id: 'cream', name: 'Heavy Cream', gramsPerCup: 238 },
  { id: 'sour_cream', name: 'Sour Cream', gramsPerCup: 242 },
  { id: 'yogurt', name: 'Yogurt', gramsPerCup: 245 },
  { id: 'cocoa', name: 'Cocoa Powder', gramsPerCup: 86 },
  { id: 'oats', name: 'Rolled Oats', gramsPerCup: 90 },
  { id: 'rice', name: 'Rice (uncooked)', gramsPerCup: 185 },
  { id: 'almonds', name: 'Almonds (sliced)', gramsPerCup: 92 },
  { id: 'walnuts', name: 'Walnuts (chopped)', gramsPerCup: 120 },
  { id: 'chocolate_chips', name: 'Chocolate Chips', gramsPerCup: 170 },
  { id: 'raisins', name: 'Raisins', gramsPerCup: 145 },
  { id: 'salt', name: 'Salt (table)', gramsPerCup: 288 },
  { id: 'baking_powder', name: 'Baking Powder', gramsPerCup: 230 },
]

// Quick reference conversions
const QUICK_REFERENCES = [
  {
    title: 'Volume Equivalents',
    items: [
      '3 tsp = 1 tbsp',
      '2 tbsp = 1 fl oz',
      '4 tbsp = 1/4 cup',
      '8 tbsp = 1/2 cup',
      '16 tbsp = 1 cup',
      '1 cup = 8 fl oz',
      '2 cups = 1 pint',
      '4 cups = 1 quart',
      '4 quarts = 1 gallon',
    ]
  },
  {
    title: 'Weight Equivalents',
    items: [
      '1 oz = 28.35 g',
      '4 oz = 113 g = 1/4 lb',
      '8 oz = 227 g = 1/2 lb',
      '16 oz = 454 g = 1 lb',
      '1 kg = 2.2 lbs',
    ]
  },
  {
    title: 'Temperature',
    items: [
      '250°F = 120°C (very low)',
      '325°F = 165°C (low)',
      '350°F = 175°C (moderate)',
      '375°F = 190°C (mod-high)',
      '400°F = 200°C (hot)',
      '425°F = 220°C (very hot)',
      '450°F = 230°C (extremely hot)',
    ]
  },
  {
    title: 'Butter Measurements',
    items: [
      '1 stick = 8 tbsp = 1/2 cup = 113g',
      '1/2 stick = 4 tbsp = 1/4 cup = 57g',
      '2 sticks = 1 cup = 227g = 1/2 lb',
      '4 sticks = 2 cups = 454g = 1 lb',
    ]
  },
]

export default function KitchenCalculator() {
  const [activeTab, setActiveTab] = useState('converter')

  // Unit converter state
  const [conversionCategory, setConversionCategory] = useState('volume')
  const [fromValue, setFromValue] = useState('')
  const [fromUnit, setFromUnit] = useState('cup')
  const [toUnit, setToUnit] = useState('ml')

  // Temperature state
  const [tempValue, setTempValue] = useState('')
  const [tempUnit, setTempUnit] = useState('fahrenheit')

  // Recipe scaler state
  const [originalServings, setOriginalServings] = useState('4')
  const [desiredServings, setDesiredServings] = useState('6')
  const [ingredients, setIngredients] = useState('')

  // Ingredient converter state
  const [selectedIngredient, setSelectedIngredient] = useState(INGREDIENT_DENSITIES[0].id)
  const [ingredientCups, setIngredientCups] = useState('')

  // Get current unit list
  const getUnits = () => {
    switch (conversionCategory) {
      case 'volume': return VOLUME_UNITS
      case 'weight': return WEIGHT_UNITS
      case 'length': return LENGTH_UNITS
      default: return VOLUME_UNITS
    }
  }

  // Unit conversion calculation
  const convertedValue = useMemo(() => {
    const val = parseFloat(fromValue)
    if (isNaN(val) || val === 0) return ''

    const units = getUnits()
    const from = units.find(u => u.id === fromUnit)
    const to = units.find(u => u.id === toUnit)

    if (!from || !to) return ''

    let baseValue
    if (conversionCategory === 'volume') {
      baseValue = val * from.toMl / to.toMl
    } else if (conversionCategory === 'weight') {
      baseValue = val * from.toGram / to.toGram
    } else if (conversionCategory === 'length') {
      baseValue = val * from.toCm / to.toCm
    }

    return baseValue.toFixed(3).replace(/\.?0+$/, '')
  }, [fromValue, fromUnit, toUnit, conversionCategory])

  // Temperature conversion
  const convertedTemp = useMemo(() => {
    const val = parseFloat(tempValue)
    if (isNaN(val)) return { fahrenheit: '', celsius: '', gasmark: '' }

    let f, c
    if (tempUnit === 'fahrenheit') {
      f = val
      c = (val - 32) * 5 / 9
    } else {
      c = val
      f = (val * 9 / 5) + 32
    }

    // Gas mark approximation
    let gasmark = ''
    if (f >= 250 && f <= 500) {
      const gm = Math.round((f - 250) / 25)
      gasmark = gm <= 0 ? '1/4' : gm.toString()
    }

    return {
      fahrenheit: f.toFixed(0),
      celsius: c.toFixed(0),
      gasmark
    }
  }, [tempValue, tempUnit])

  // Recipe scaling calculation
  const scaledIngredients = useMemo(() => {
    const original = parseFloat(originalServings)
    const desired = parseFloat(desiredServings)
    if (isNaN(original) || isNaN(desired) || original === 0 || !ingredients.trim()) {
      return ''
    }

    const ratio = desired / original

    // Parse each line and scale numbers
    return ingredients.split('\n').map(line => {
      // Match numbers (including fractions like 1/2)
      return line.replace(/(\d+\/\d+|\d+\.?\d*)/g, (match) => {
        // Handle fractions
        if (match.includes('/')) {
          const [num, denom] = match.split('/')
          const decimal = parseInt(num) / parseInt(denom)
          const scaled = decimal * ratio
          // Convert back to fraction if small
          return formatScaledNumber(scaled)
        }

        const num = parseFloat(match)
        return formatScaledNumber(num * ratio)
      })
    }).join('\n')
  }, [originalServings, desiredServings, ingredients])

  // Ingredient weight conversion
  const ingredientWeight = useMemo(() => {
    const cups = parseFloat(ingredientCups)
    if (isNaN(cups)) return ''

    const ingredient = INGREDIENT_DENSITIES.find(i => i.id === selectedIngredient)
    if (!ingredient) return ''

    const grams = cups * ingredient.gramsPerCup
    return {
      grams: grams.toFixed(0),
      ounces: (grams / 28.3495).toFixed(1)
    }
  }, [ingredientCups, selectedIngredient])

  // Format scaled numbers nicely
  function formatScaledNumber(num) {
    // Common fractions to use
    const fractions = [
      { value: 0.125, display: '1/8' },
      { value: 0.25, display: '1/4' },
      { value: 0.333, display: '1/3' },
      { value: 0.375, display: '3/8' },
      { value: 0.5, display: '1/2' },
      { value: 0.625, display: '5/8' },
      { value: 0.666, display: '2/3' },
      { value: 0.75, display: '3/4' },
      { value: 0.875, display: '7/8' },
    ]

    const whole = Math.floor(num)
    const decimal = num - whole

    // Find closest fraction
    let closestFraction = null
    let minDiff = 0.1
    for (const frac of fractions) {
      const diff = Math.abs(decimal - frac.value)
      if (diff < minDiff) {
        minDiff = diff
        closestFraction = frac
      }
    }

    if (decimal < 0.0625) {
      return whole.toString()
    } else if (closestFraction && minDiff < 0.05) {
      return whole > 0
        ? `${whole} ${closestFraction.display}`
        : closestFraction.display
    } else {
      return num.toFixed(2).replace(/\.?0+$/, '')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kitchen Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convert units, scale recipes, and get precise measurements
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { id: 'converter', label: 'Unit Converter', icon: '🔄' },
          { id: 'temperature', label: 'Temperature', icon: '🌡️' },
          { id: 'scaler', label: 'Recipe Scaler', icon: '📊' },
          { id: 'ingredients', label: 'Ingredient Weights', icon: '⚖️' },
          { id: 'reference', label: 'Quick Reference', icon: '📋' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Unit Converter */}
      {activeTab === 'converter' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Unit Converter</h2>

          {/* Category selector */}
          <div className="flex gap-2 mb-6">
            {CONVERSION_CATEGORIES.filter(c => c.id !== 'temperature').map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setConversionCategory(cat.id)
                  const units = cat.id === 'volume' ? VOLUME_UNITS : cat.id === 'weight' ? WEIGHT_UNITS : LENGTH_UNITS
                  setFromUnit(units[0].id)
                  setToUnit(units[units.length > 1 ? units.length - 2 : 0].id)
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  conversionCategory === cat.id
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Converter inputs */}
          <div className="grid md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                >
                  {getUnits().map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-2xl text-gray-400">=</span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-3 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-700 dark:text-primary-300 font-semibold text-lg">
                  {convertedValue || '—'}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                >
                  {getUnits().map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temperature Converter */}
      {activeTab === 'temperature' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Temperature Converter</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Temperature</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Enter temperature"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white text-lg"
                />
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value)}
                  className="px-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                >
                  <option value="fahrenheit">°F</option>
                  <option value="celsius">°C</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-sm text-red-600 dark:text-red-400">Fahrenheit</div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {convertedTemp.fahrenheit ? `${convertedTemp.fahrenheit}°F` : '—'}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-blue-600 dark:text-blue-400">Celsius</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {convertedTemp.celsius ? `${convertedTemp.celsius}°C` : '—'}
                </div>
              </div>
              {convertedTemp.gasmark && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div className="text-sm text-amber-600 dark:text-amber-400">Gas Mark</div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    Mark {convertedTemp.gasmark}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Common temperatures */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Common Oven Temperatures</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { f: 325, label: 'Low' },
                { f: 350, label: 'Moderate' },
                { f: 375, label: 'Mod-High' },
                { f: 400, label: 'Hot' },
                { f: 425, label: 'Very Hot' },
                { f: 450, label: 'Extremely Hot' },
                { f: 475, label: 'Broil' },
                { f: 500, label: 'Pizza' },
              ].map(temp => (
                <button
                  key={temp.f}
                  onClick={() => { setTempValue(temp.f.toString()); setTempUnit('fahrenheit') }}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{temp.f}°F / {Math.round((temp.f - 32) * 5/9)}°C</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">{temp.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Scaler */}
      {activeTab === 'scaler' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recipe Scaler</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Servings</label>
                  <input
                    type="number"
                    value={originalServings}
                    onChange={(e) => setOriginalServings(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-end pb-3">
                  <span className="text-2xl">→</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Desired Servings</label>
                  <input
                    type="number"
                    value={desiredServings}
                    onChange={(e) => setDesiredServings(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Paste Ingredients (one per line)
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="2 cups flour&#10;1/2 cup sugar&#10;3 eggs&#10;1 tsp vanilla"
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Scaled Ingredients ({desiredServings} servings)
              </label>
              <div className="h-full min-h-[200px] px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 font-mono text-sm whitespace-pre-line">
                {scaledIngredients || 'Enter ingredients to see scaled amounts...'}
              </div>
            </div>
          </div>

          {/* Quick multiply buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Quick scale:</span>
            {[0.5, 1.5, 2, 3, 4].map(multiplier => (
              <button
                key={multiplier}
                onClick={() => setDesiredServings((parseFloat(originalServings) * multiplier).toString())}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {multiplier}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient Weights */}
      {activeTab === 'ingredients' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ingredient Weight Converter</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Convert volume (cups) to weight (grams/ounces) for precise baking
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Ingredient</label>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                >
                  {INGREDIENT_DENSITIES.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Cups</label>
                <input
                  type="number"
                  value={ingredientCups}
                  onChange={(e) => setIngredientCups(e.target.value)}
                  placeholder="e.g., 2.5"
                  step="0.25"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {ingredientWeight && (
                <>
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
                    <div className="text-sm text-primary-600 dark:text-primary-400">Grams</div>
                    <div className="text-3xl font-bold text-primary-700 dark:text-primary-300">
                      {ingredientWeight.grams}g
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
                    <div className="text-sm text-amber-600 dark:text-amber-400">Ounces</div>
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {ingredientWeight.ounces} oz
                    </div>
                  </div>
                </>
              )}
              {!ingredientWeight && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400">
                  Enter cups to see weight conversion
                </div>
              )}
            </div>
          </div>

          {/* Common weights reference */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Common Baking Ingredients (per cup)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {INGREDIENT_DENSITIES.slice(0, 8).map(ing => (
                <div
                  key={ing.id}
                  className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{ing.name}</div>
                  <div className="text-gray-500 dark:text-gray-400">{ing.gramsPerCup}g / cup</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      {activeTab === 'reference' && (
        <div className="grid md:grid-cols-2 gap-4">
          {QUICK_REFERENCES.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <span className="text-primary-500">•</span>
                    <span className="font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Egg sizes reference */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Egg Sizes</h3>
            <ul className="space-y-2">
              {[
                { size: 'Small', weight: '43g', whole: '1.5 oz' },
                { size: 'Medium', weight: '50g', whole: '1.75 oz' },
                { size: 'Large', weight: '57g', whole: '2 oz' },
                { size: 'Extra-Large', weight: '64g', whole: '2.25 oz' },
                { size: 'Jumbo', weight: '71g', whole: '2.5 oz' },
              ].map((egg, i) => (
                <li key={i} className="flex justify-between text-gray-700 dark:text-gray-300 text-sm">
                  <span>{egg.size}</span>
                  <span className="font-mono text-gray-500">{egg.weight} ({egg.whole})</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pan size conversions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Pan Size Volumes</h3>
            <ul className="space-y-2">
              {[
                { pan: '8" round (2" deep)', cups: '6 cups' },
                { pan: '9" round (2" deep)', cups: '8 cups' },
                { pan: '8" square', cups: '8 cups' },
                { pan: '9" square', cups: '10 cups' },
                { pan: '9x13" rectangle', cups: '14 cups' },
                { pan: '9x5" loaf', cups: '8 cups' },
                { pan: '10" bundt', cups: '12 cups' },
                { pan: '12-cup muffin', cups: '1/3 cup each' },
              ].map((pan, i) => (
                <li key={i} className="flex justify-between text-gray-700 dark:text-gray-300 text-sm">
                  <span>{pan.pan}</span>
                  <span className="font-mono text-gray-500">{pan.cups}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
