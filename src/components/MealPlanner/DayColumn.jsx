import { Link } from 'react-router-dom'
import { useApp, MEAL_SLOTS } from '../../context/AppContext'

export default function DayColumn({
  day,
  dayData,
  slotConfig,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
  draggedItem,
}) {
  const { removeFromMealPlan, clearDay } = useApp()

  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1)

  // Count total meals for the day
  const mealCount = MEAL_SLOTS.reduce((count, slot) => {
    if (slot === 'snacks') {
      return count + (dayData?.snacks?.length || 0)
    }
    return count + (dayData?.[slot] ? 1 : 0)
  }, 0)

  const renderMealCard = (meal, slot, index = null) => {
    if (!meal) return null

    const isBeingDragged = draggedItem?.meal?.idMeal === meal.idMeal &&
                           draggedItem?.day === day &&
                           draggedItem?.slot === slot

    return (
      <div
        key={meal.idMeal}
        draggable
        onDragStart={(e) => onDragStart(e, day, slot, meal, index)}
        onDragEnd={onDragEnd}
        className={`group flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
          isBeingDragged ? 'opacity-50 scale-95' : ''
        }`}
      >
        <Link to={`/recipe/${meal.idMeal}`} className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
            {meal.strMeal}
          </span>
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeFromMealPlan(day, slot, meal.idMeal)
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
          aria-label={`Remove ${meal.strMeal}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  const renderSlot = (slot) => {
    const config = slotConfig[slot]
    const isSnacks = slot === 'snacks'
    const meals = isSnacks ? (dayData?.snacks || []) : (dayData?.[slot] ? [dayData[slot]] : [])
    const isEmpty = meals.length === 0
    const isDropTarget = isDragOver(day, slot)

    return (
      <div
        key={slot}
        className={`transition-all ${isDropTarget ? 'scale-[1.02]' : ''}`}
        onDragOver={(e) => onDragOver(e, day, slot)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, day, slot)}
      >
        {/* Slot Header */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-sm">{config.icon}</span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{config.label}</span>
          {isSnacks && meals.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">({meals.length})</span>
          )}
        </div>

        {/* Slot Content */}
        <div
          className={`min-h-[52px] rounded-lg transition-all ${
            isDropTarget
              ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-dashed border-primary-400 dark:border-primary-600'
              : isEmpty
                ? 'bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700'
                : ''
          }`}
        >
          {isEmpty ? (
            <div className={`h-full min-h-[52px] flex items-center justify-center ${
              isDropTarget ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'
            }`}>
              <span className="text-xs">
                {isDropTarget ? 'Drop here' : `+ ${config.label}`}
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {meals.map((meal, idx) => renderMealCard(meal, slot, isSnacks ? idx : null))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{capitalizedDay}</h3>
          {mealCount > 0 && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {mealCount} meal{mealCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {mealCount > 0 && (
          <button
            onClick={() => clearDay(day)}
            className="text-white/80 hover:text-white text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors"
            aria-label={`Clear ${capitalizedDay}`}
          >
            Clear
          </button>
        )}
      </div>

      {/* Meal Slots */}
      <div className="p-3 space-y-3">
        {MEAL_SLOTS.map(slot => renderSlot(slot))}
      </div>
    </div>
  )
}
