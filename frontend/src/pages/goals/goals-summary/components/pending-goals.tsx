import { OutlineButton } from '../../../../components/outline-button'
import { getWeekPendingGoals } from '../../../../http/get-week-pending-goals'
import { createGoalCompletion } from '../../../../http/create-goal-completion'

import { Pen, Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface PendingGoalsProps {
  year: number
  weekOfYear: number
  onManageGoalsTrigger: () => void
}

export function PendingGoals({
  year,
  weekOfYear,
  onManageGoalsTrigger,
}: PendingGoalsProps) {
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
    <div className="space-y-3 space-x-3 -mt-3 -ml-3">
      <div className="h-[38px] mt-3 float-right">
        <button
          onClick={onManageGoalsTrigger}
          type="button"
          className="p-1 text-zinc-500 enabled:hover:text-zinc-400"
        >
          <Pen className="size-3.5" />
        </button>
      </div>

      {sortedPendingGoals.map(goal => {
        const completed = goal.completionCount >= goal.desiredWeeklyFrequency

        return (
          <OutlineButton
            key={goal.id}
            disabled={completed}
            className="float-left"
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
