import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import ShoppingItem from './ShoppingItem'

export default function ShoppingList() {
  const { shoppingList, addShoppingItem, clearShoppingList, clearCompletedItems } = useApp()
  const [newItem, setNewItem] = useState('')

  const handleAddItem = (e) => {
    e.preventDefault()
    if (newItem.trim()) {
      addShoppingItem({ name: newItem.trim() })
      setNewItem('')
    }
  }

  const checkedCount = shoppingList.filter((item) => item.checked).length
  const uncheckedCount = shoppingList.length - checkedCount

  // Group items by category
  const groupedItems = shoppingList.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'From Meal Plan') return -1
    if (b === 'From Meal Plan') return 1
    if (a === 'Other') return 1
    if (b === 'Other') return -1
    return a.localeCompare(b)
  })

  return (
    <div className="space-y-6">
      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item..."
          className="input flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {/* Stats & Actions */}
      {shoppingList.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{uncheckedCount}</span> items remaining
            {checkedCount > 0 && (
              <span className="ml-2 text-gray-400">
                ({checkedCount} completed)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {checkedCount > 0 && (
              <button
                onClick={clearCompletedItems}
                className="btn btn-secondary text-sm"
              >
                Clear Completed
              </button>
            )}
            <button
              onClick={clearShoppingList}
              className="btn btn-secondary text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Shopping List */}
      {shoppingList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-gray-500 text-lg">Your shopping list is empty</p>
          <p className="text-gray-400 text-sm mt-2">
            Add items manually or generate from your meal plan
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {groupedItems[category].map((item) => (
                  <ShoppingItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
