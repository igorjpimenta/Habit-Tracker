import { OutlineButton } from '../../../../components/outline-button'
import { getWeekPendingGoals } from '../../../../http/get-week-pending-goals'
import { createGoalCompletion } from '../../../../http/create-goal-completion'

import { Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface PendingGoalsProps {
  year: number
  weekOfYear: number
}

export function PendingGoals({ year, weekOfYear }: PendingGoalsProps) {
  const queryClient = useQueryClient()

  const { data: pendingGoals } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getWeekPendingGoals,
    staleTime: 1000 * 60,
  })

  if (!pendingGoals) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion({ goalId })

    queryClient.invalidateQueries({ queryKey: ['summary', year, weekOfYear] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
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
          <OutlineButton
            key={goal.id}
            disabled={completed}
            onClick={() => handleCompleteGoal(goal.id)}
          >
            <Plus className="size-4 text-zinc-400" />
            {goal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
