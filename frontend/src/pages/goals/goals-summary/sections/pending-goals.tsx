import { getWeekPendingGoals } from '../../../../http/get-week-pending-goals'

import { useQuery } from '@tanstack/react-query'
import { PendingGoal } from '../components/pending-goal'

interface PendingGoalsProps {
  year: number
  weekOfYear: number
}

export function PendingGoals({ year, weekOfYear }: PendingGoalsProps) {
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
          <PendingGoal
            key={goal.id}
            goalId={goal.id}
            {...goal}
            completed={completed}
            year={year}
            weekOfYear={weekOfYear}
          />
        )
      })}
    </div>
  )
}
