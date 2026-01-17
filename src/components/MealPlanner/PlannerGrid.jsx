import { useState } from 'react'
import { useApp, DAYS, MEAL_SLOTS } from '../../context/AppContext'
import DayColumn from './DayColumn'

const SLOT_CONFIG = {
  breakfast: { label: 'Breakfast', icon: '🌅', color: 'from-amber-400 to-orange-500' },
  lunch: { label: 'Lunch', icon: '☀️', color: 'from-yellow-400 to-amber-500' },
  dinner: { label: 'Dinner', icon: '🌙', color: 'from-indigo-400 to-purple-500' },
  snacks: { label: 'Snacks', icon: '🍿', color: 'from-pink-400 to-rose-500' },
  dessert: { label: 'Dessert', icon: '🍰', color: 'from-rose-400 to-pink-500' },
}

export { SLOT_CONFIG }

export default function PlannerGrid() {
  const { mealPlan, moveMeal } = useApp()
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverTarget, setDragOverTarget] = useState(null)

  const handleDragStart = (e, day, slot, meal, index = null) => {
    setDraggedItem({ day, slot, meal, index })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ day, slot, mealId: meal.idMeal, index }))
    // Add some visual feedback
    e.target.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1'
    setDraggedItem(null)
    setDragOverTarget(null)
  }

  const handleDragOver = (e, day, slot) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverTarget({ day, slot })
  }

  const handleDragLeave = () => {
    setDragOverTarget(null)
  }

  const handleDrop = (e, toDay, toSlot) => {
    e.preventDefault()
    setDragOverTarget(null)

    if (!draggedItem) return

    const { day: fromDay, slot: fromSlot, meal, index: fromIndex } = draggedItem

    // Don't drop on the same slot
    if (fromDay === toDay && fromSlot === toSlot) {
      setDraggedItem(null)
      return
    }

    moveMeal(fromDay, fromSlot, toDay, toSlot, meal, fromIndex)
    setDraggedItem(null)
  }

  const isDragOver = (day, slot) => {
    return dragOverTarget?.day === day && dragOverTarget?.slot === slot
  }

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <DayColumn
            key={day}
            day={day}
            dayData={mealPlan[day]}
            slotConfig={SLOT_CONFIG}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            isDragOver={isDragOver}
            draggedItem={draggedItem}
          />
        ))}
      </div>
    </div>
  )
}
