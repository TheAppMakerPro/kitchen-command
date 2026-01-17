import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SMART_COLLECTIONS } from '../hooks/useMeals'

// Color mappings for collection cards
const colorClasses = {
  indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/25',
  blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
  rose: 'from-rose-500 to-rose-600 shadow-rose-500/25',
  amber: 'from-amber-500 to-amber-600 shadow-amber-500/25',
  emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
  green: 'from-green-500 to-green-600 shadow-green-500/25',
  orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
  purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
  gray: 'from-gray-500 to-gray-600 shadow-gray-500/25',
  red: 'from-red-500 to-red-600 shadow-red-500/25',
  teal: 'from-teal-500 to-teal-600 shadow-teal-500/25',
  pink: 'from-pink-500 to-pink-600 shadow-pink-500/25',
}

const COLLECTION_ICONS = ['📁', '🍳', '🥗', '🍰', '🌮', '🍜', '🥘', '🍝', '🥧', '🍱', '🥡', '🍛']
const COLLECTION_COLORS = ['indigo', 'blue', 'rose', 'amber', 'emerald', 'green', 'orange', 'purple', 'teal', 'pink', 'red']

export default function Collections() {
  const { customCollections, createCollection, deleteCollection } = useApp()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCollection, setNewCollection] = useState({ name: '', description: '', icon: '📁', color: 'indigo' })

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return
    createCollection(newCollection)
    setNewCollection({ name: '', description: '', icon: '📁', color: 'indigo' })
    setShowCreateModal(false)
  }

  const handleDeleteCollection = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Collections
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover curated recipe collections or create your own
        </p>
      </div>

      {/* Smart Collections */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Smart Collections
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Auto-curated based on different occasions and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SMART_COLLECTIONS.map(collection => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[collection.color]} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="relative p-6 text-white">
                <span className="text-4xl mb-3 block">{collection.icon}</span>
                <h3 className="text-lg font-bold mb-1">{collection.name}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{collection.description}</p>
                <div className="mt-4 flex items-center text-sm text-white/70">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {collection.categories?.length || collection.areas?.length || 0} sources
                </div>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* User Collections */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">📚</span>
              My Collections
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your personal recipe collections
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>

        {customCollections.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No collections yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Create your first collection to organize your favorite recipes by occasion, cuisine, or any way you like!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCollections.map(collection => (
              <Link
                key={collection.id}
                to={`/collections/custom/${collection.id}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${colorClasses[collection.color]}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{collection.icon}</span>
                    <button
                      onClick={(e) => handleDeleteCollection(e, collection.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-1">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-sm text-gray-400 dark:text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {collection.recipeIds.length} recipe{collection.recipeIds.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Create New Collection
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  placeholder="e.g., Sunday Brunch Ideas"
                  className="input"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  placeholder="A brief description..."
                  className="input"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLLECTION_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewCollection({ ...newCollection, icon })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        newCollection.icon === icon
                          ? 'bg-primary-100 dark:bg-primary-900/50 ring-2 ring-primary-500'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLLECTION_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCollection({ ...newCollection, color })}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClasses[color]} transition-all ${
                        newCollection.color === color
                          ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                disabled={!newCollection.name.trim()}
                className="flex-1 btn btn-primary"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
