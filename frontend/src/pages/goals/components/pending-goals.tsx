import { OutlineButton } from '../../../components/outline-button'
import { getWeekPendingGoals } from '../../../http/get-week-pending-goals'

import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

export function PendingGoals() {
  const { data: pendingGoals } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getWeekPendingGoals,
    staleTime: 1000 * 60,
  })

  if (!pendingGoals) {
    return null
  }

  const sortedPendingGoals = pendingGoals.sort((a, b) => {
    const isACompleted = a.completionCount >= a.desiredWeeklyFrequency
    const isBCompleted = b.completionCount >= b.desiredWeeklyFrequency

    if (isACompleted !== isBCompleted) {
      return isACompleted ? 1 : -1
    }

    return a.title.localeCompare(b.title)
  })

  return (
    <div className="flex flex-wrap gap-3">
      {sortedPendingGoals.map(goal => {
        const completed = goal.completionCount >= goal.desiredWeeklyFrequency

        return (
          <OutlineButton key={goal.id} disabled={completed}>
            <Plus className="size-4 text-zinc-400" />
            {goal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
