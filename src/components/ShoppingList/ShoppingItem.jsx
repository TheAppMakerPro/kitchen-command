import { useApp } from '../../context/AppContext'

export default function ShoppingItem({ item }) {
  const { toggleShoppingItem, removeShoppingItem } = useApp()

  return (
    <div
      className={`group flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${
        item.checked ? 'border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleShoppingItem(item.id)}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          item.checked
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'border-gray-300 hover:border-primary-500'
        }`}
        aria-label={item.checked ? 'Mark as unchecked' : 'Mark as checked'}
      >
        {item.checked && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Item Details */}
      <div className={`flex-1 ${item.checked ? 'line-through text-gray-400' : ''}`}>
        <span className="font-medium">{item.name}</span>
        {item.quantity && (
          <span className="ml-2 text-gray-500 text-sm">({item.quantity})</span>
        )}
      </div>

      {/* Category Badge */}
      {item.category && item.category !== 'Other' && (
        <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {item.category}
        </span>
      )}

      {/* Remove Button */}
      <button
        onClick={() => removeShoppingItem(item.id)}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
        aria-label={`Remove ${item.name}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
