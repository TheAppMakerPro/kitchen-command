import { Link } from 'react-router-dom'
import { useState } from 'react'

// FAQ Data
const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Kitchen Command?',
        a: 'Kitchen Command is your personal recipe hub - a free web app that helps you discover, save, and plan delicious meals. Search thousands of recipes, create meal plans, generate shopping lists, and access your favorite recipes offline.'
      },
      {
        q: 'Is Kitchen Command free to use?',
        a: 'Yes! Kitchen Command is completely free to use. There are no subscriptions, hidden fees, or premium tiers. All features are available to everyone.'
      },
      {
        q: 'Do I need to create an account?',
        a: 'No account is required! Kitchen Command stores your favorites, meal plans, and preferences locally on your device. Your data stays private and you can start using the app immediately.'
      },
      {
        q: 'Can I install Kitchen Command on my phone?',
        a: 'Yes! Kitchen Command is a Progressive Web App (PWA). On your phone, tap the browser menu and select "Add to Home Screen" to install it like a native app. It works on both iOS and Android.'
      }
    ]
  },
  {
    category: 'Recipe Search & Discovery',
    questions: [
      {
        q: 'How do I search for recipes?',
        a: 'Use the search bar to find recipes by name, or use the filters to browse by category (Dessert, Seafood, Vegetarian, etc.), cuisine (Italian, Mexican, Indian, etc.), or main ingredient. You can combine multiple filters for precise results.'
      },
      {
        q: 'What recipe information is available?',
        a: 'Each recipe includes a photo, ingredient list with measurements, step-by-step cooking instructions, cuisine type, category, estimated cooking time, difficulty level, and serving size. Many recipes also include video tutorials.'
      },
      {
        q: 'Can I filter recipes by dietary requirements?',
        a: 'Yes! Go to Dietary Preferences to set your requirements (vegetarian, vegan, gluten-free, etc.) and allergen alerts. The app will highlight recipes that match your preferences and warn you about potential allergens.'
      },
      {
        q: 'How does the "Random Recipe" feature work?',
        a: 'Click the shuffle button or visit the home page to discover random recipes. It\'s a great way to find inspiration when you\'re not sure what to cook!'
      }
    ]
  },
  {
    category: 'Favorites & Collections',
    questions: [
      {
        q: 'How do I save a recipe to favorites?',
        a: 'Click the heart icon on any recipe card or recipe page to add it to your favorites. Click again to remove it. Your favorites are saved locally and persist between sessions.'
      },
      {
        q: 'What are Collections?',
        a: 'Collections are curated groups of recipes organized by theme - like "Quick Weeknight Dinners", "Comfort Food Classics", or "Healthy Lunch Ideas". Browse collections for inspiration based on your mood or occasion.'
      },
      {
        q: 'Can I create my own collections?',
        a: 'Currently, you can save recipes to your favorites list. Custom collection creation is a feature we\'re considering for future updates.'
      }
    ]
  },
  {
    category: 'Meal Planning',
    questions: [
      {
        q: 'How does the Meal Planner work?',
        a: 'The Meal Planner lets you organize recipes for each day of the week. Simply browse recipes and click "Add to Meal Plan" to assign them to specific days. You can plan breakfast, lunch, dinner, and snacks.'
      },
      {
        q: 'Can I plan meals for multiple weeks?',
        a: 'The current meal planner focuses on a weekly view. You can clear and replan each week, and your current week\'s plan is saved automatically.'
      },
      {
        q: 'How do I remove a meal from my plan?',
        a: 'In the Meal Planner, click the X button on any planned meal to remove it from that day.'
      }
    ]
  },
  {
    category: 'Shopping List',
    questions: [
      {
        q: 'How do I generate a shopping list?',
        a: 'After planning your meals, go to the Shopping List page and click "Generate from Meal Plan". The app will automatically compile all ingredients from your planned recipes into a organized shopping list.'
      },
      {
        q: 'Can I manually add items to the shopping list?',
        a: 'Yes! You can add custom items to your shopping list at any time. Just type the item name and quantity, then click Add.'
      },
      {
        q: 'How do I mark items as purchased?',
        a: 'Tap or click on any item to check it off. Checked items move to a "Completed" section. You can clear all completed items at once or uncheck them if needed.'
      },
      {
        q: 'Are ingredients grouped by category?',
        a: 'Yes! The shopping list organizes ingredients by category (Produce, Dairy, Meat, Pantry, etc.) to make your grocery shopping more efficient.'
      }
    ]
  },
  {
    category: 'My Fridge',
    questions: [
      {
        q: 'What is the "My Fridge" feature?',
        a: 'My Fridge lets you track ingredients you already have at home. Add your available ingredients, and the app will suggest recipes you can make with what you have - reducing food waste and saving money.'
      },
      {
        q: 'How do I add ingredients to My Fridge?',
        a: 'Go to the My Fridge page and use the search or browse to add ingredients. You can add items by name and the app will match them to recipe ingredients.'
      },
      {
        q: 'How accurate are the recipe suggestions?',
        a: 'The app matches your fridge ingredients against recipe ingredient lists. Recipes are ranked by how many of your ingredients they use. You\'ll see which ingredients you have and which you\'ll need to buy.'
      }
    ]
  },
  {
    category: 'Cooking Tools',
    questions: [
      {
        q: 'What is the Kitchen Calculator?',
        a: 'The Kitchen Calculator helps with common cooking conversions - cups to grams, Fahrenheit to Celsius, tablespoons to milliliters, and more. It also includes a recipe scaler to adjust serving sizes.'
      },
      {
        q: 'What are Cooking Techniques?',
        a: 'The Technique Library contains guides for essential cooking methods like sautéing, braising, roasting, and more. Each technique includes tips, best practices, and recommended recipes to practice with.'
      },
      {
        q: 'What is the Ingredient Glossary?',
        a: 'The Ingredient Glossary provides information about various ingredients - what they are, how to select them, storage tips, and common substitutions. Great for learning about unfamiliar ingredients in recipes.'
      },
      {
        q: 'What are Seasonal Guides?',
        a: 'Seasonal Guides show you what produce is in season throughout the year. Cooking with seasonal ingredients means better flavor, lower prices, and more sustainable choices.'
      },
      {
        q: 'What are Meal Prep Guides?',
        a: 'Meal Prep Guides provide strategies and tips for preparing meals in advance. Learn batch cooking techniques, storage tips, and time-saving strategies for busy weeks.'
      }
    ]
  },
  {
    category: 'Offline & Data',
    questions: [
      {
        q: 'Does Kitchen Command work offline?',
        a: 'Yes! Once you\'ve viewed a recipe, it\'s cached on your device. You can access your favorites and previously viewed recipes without an internet connection. New searches require connectivity.'
      },
      {
        q: 'Where is my data stored?',
        a: 'All your data (favorites, meal plans, shopping lists, preferences) is stored locally in your browser\'s storage. Nothing is sent to external servers - your data stays on your device.'
      },
      {
        q: 'How do I clear my data?',
        a: 'You can clear individual items (favorites, meal plans, etc.) within the app, or clear all app data through your browser\'s settings by clearing site data for the Kitchen Command domain.'
      },
      {
        q: 'Will my data sync across devices?',
        a: 'Currently, data is stored locally on each device and doesn\'t sync. If you use Kitchen Command on multiple devices, each will have its own separate data.'
      }
    ]
  },
  {
    category: 'Accessibility',
    questions: [
      {
        q: 'Is Kitchen Command accessible?',
        a: 'Yes! The app is designed with accessibility in mind. It supports keyboard navigation, works with screen readers, and includes options for increased text size, high contrast mode, and color blind friendly themes.'
      },
      {
        q: 'How do I access accessibility settings?',
        a: 'Click the accessibility icon in the header to open the Accessibility Settings panel. Here you can adjust text size, enable high contrast mode, reduce animations, and select color blind friendly modes.'
      },
      {
        q: 'Does the app support dark mode?',
        a: 'Yes! Toggle dark mode using the sun/moon icon in the header. The app will also respect your system\'s dark mode preference by default.'
      }
    ]
  }
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-amber-200 dark:border-amber-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white pr-4">{question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-amber-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

function FAQCategory({ category, questions }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
        {category}
      </h3>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {questions.map((item, index) => (
          <FAQItem key={index} question={item.q} answer={item.a} />
        ))}
      </div>
    </div>
  )
}

const features = [
  { icon: '🔍', title: 'Recipe Search', desc: 'Search thousands of recipes by name, ingredient, or cuisine' },
  { icon: '❤️', title: 'Save Favorites', desc: 'Keep your favorite recipes one tap away' },
  { icon: '📅', title: 'Meal Planner', desc: 'Plan your weekly meals with ease' },
  { icon: '🛒', title: 'Shopping List', desc: 'Auto-generate lists from your meal plan' },
  { icon: '🥗', title: 'Dietary Filters', desc: 'Filter by vegetarian, vegan, gluten-free & more' },
  { icon: '🥡', title: 'My Fridge', desc: 'Find recipes with ingredients you have' },
  { icon: '📴', title: 'Works Offline', desc: 'Access saved recipes without internet' },
  { icon: '📱', title: 'Install as App', desc: 'Add to home screen on any device' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-200 dark:bg-amber-900/30 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-200 dark:bg-orange-900/30 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            {/* App Icon */}
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                <img
                  src="/icon.png"
                  alt="Kitchen Command"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-2xl"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
                Kitchen Command
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your personal recipe hub — search, save, and plan delicious meals
            </p>

            {/* CTA Button */}
            <Link
              to="/home"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <span>Open App</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Sub-text */}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Free to use • No account required • Works offline
            </p>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Everything you need in the kitchen
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Beautiful & Easy to Use
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern interface designed for home cooks. Browse recipes, plan meals, and generate shopping lists — all in one place.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Discover</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Browse recipes from cuisines around the world</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Plan</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organize your weekly meals effortlessly</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Cook</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Follow step-by-step instructions</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4" id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            Everything you need to know about Kitchen Command
          </p>

          {faqData.map((category, index) => (
            <FAQCategory
              key={index}
              category={category.category}
              questions={category.questions}
            />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get cooking?
            </h2>
            <p className="text-amber-100 mb-8 text-lg">
              Start exploring thousands of recipes right now — no signup required.
            </p>
            <Link
              to="/home"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-700 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Open Kitchen Command</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/icon.png" alt="Kitchen Command" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-gray-900 dark:text-white">Kitchen Command</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with love for home cooks everywhere
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Recipe data provided by TheMealDB
          </p>
        </div>
      </footer>
    </div>
  )
}
