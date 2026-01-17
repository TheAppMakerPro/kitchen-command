import { Link } from 'react-router-dom'
import ShoppingList from '../components/ShoppingList/ShoppingList'

export default function ShoppingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
          <p className="text-gray-600">
            Keep track of ingredients you need to buy
          </p>
        </div>
        <Link to="/meal-planner" className="btn btn-outline">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Go to Meal Planner
        </Link>
      </div>

      <ShoppingList />
    </div>
  )
}
